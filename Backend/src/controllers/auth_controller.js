require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../database/models");

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge,
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------------------------- GOOGLE LOGIN -----------------------------------------------
module.exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // This is the access_token from frontend
    console.log("req.body:", req.body);
    console.log("Received Google ID Token:", idToken);
    
    // 1. Fetch User Info from Google (using the access_token)
    // We use axios directly since google-auth-library verifyIdToken expects an ID Token (JWT)
    // but the frontend hook returns an access_token (Opaque).

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name,  sub: googleId, picture } = payload;

    // Optional: Verify the token was issued to OUR app (Security Best Practice)
    // const tokenInfo = await client.getTokenInfo(token);
    // if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) throw new Error("Token audience mismatch");

    // 2. Check if user exists
    let user = await db.AuthUser.findOne({ where: { email } });

    if (user) {
      // Scenario 2: User exists (Local or Google)
      // If no googleId, link account (Scenario 2 - Local first)
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
      // Scenario 3: User exists (Google first) - proceed to login
    } else {
      // Scenario 1: New User
      // Note: isAdmin is NOT set here, so it defaults to false (as per model definition).
      // Users cannot choose to be admin.
      user = await db.AuthUser.create({
        email,
        name,
        googleId,
        avatar: picture,
        password: null // Explicitly null
      });
    }

    // 3. Generate Tokens (Reusing existing logic)
    const access_token = jwt.sign(
      { id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const refresh_token = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Set Cookies
    res.cookie("access_token", access_token, cookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie("refresh_token", refresh_token, cookieOptions(7 * 24 * 60 * 60 * 1000));

    // 5. Response
    res.status(200).json({
      message: "Logged in with Google successfully!",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      },
    });

  } catch (err) {
    console.error("Google Login error:", err);
    res.status(500).json({
      error: "Google login failed",
      message: err.message,
    });
  }
};

// ---------------------------------------REGISTER---------------------------------------------------
module.exports.registerUser = async (req, res) => {
  try {
    const { password, name, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingUser = await db.AuthUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.AuthUser.create({
      name,
      password: hashedPassword,
      email,
      // isAdmin defaults to false. Secure.
    });

    const access_token = jwt.sign(
      { id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const refresh_token = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", access_token, cookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie("refresh_token", refresh_token, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};

// --------------------------------------LOGIN --------------------------------------------------------
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await db.AuthUser.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const access_token = jwt.sign(
      { id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const refresh_token = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", access_token, cookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie("refresh_token", refresh_token, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};

// -------------------------------- REFRESH ACCESS TOKEN ----------------------------------------------------------
module.exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Session expired. Please log in again.",
          });
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie(
          "access_token",
          newAccessToken,
          cookieOptions(7 * 24 * 60 * 60 * 1000)
        );
        res.status(200).json({
          message: "Access token refreshed successfully.",
        });
      }
    );
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({
      error: "Something went wrong during token refresh.",
      message: err.message,
    });
  }
};

// ----------------------------------- LOGOUT ---------------------
module.exports.logout = async (req, res) => {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };
    res.clearCookie("access_token", clearOptions);
    res.clearCookie("refresh_token", clearOptions);
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};



//-------------------------------------------GET CURRENT USER ----------------------------------------------
module.exports.getCurrentUser = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken) {
      return res.status(401).json({ message: "Not logged in." });
    }
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Invalid or expired token.",
          });
        }
        const user = await db.AuthUser.findByPk(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
          user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      }
    );
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};

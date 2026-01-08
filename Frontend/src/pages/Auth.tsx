import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/axios";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const res = await api.post("/api/auth/google", {
  //         token: tokenResponse.access_token, 
  //       });
  //       login(res.data.user);
  //       toast({
  //         title: "Welcome Back!",
  //         description: "You have successfully logged in.",
  //       });
  //       navigate("/dashboard");
  //     } catch (error: any) {
  //       toast({
  //         title: "Authentication Failed",
  //         description: "Unable to sign in with Google. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Authentication Cancelled",
  //       description: "Google sign-in was interrupted. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  //   // flow: "auth-code", // Use if you need offline access (refresh tokens) from Google directly, but here we just need identity
  // });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setIsSubmitting(false);
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!loginData.email || !loginData.password) {
      setIsSubmitting(false); // ✅ Reset loading state
      toast({
        title: "Input Required",
        description: "Please enter both your email and password to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post(`/api/auth/login`, loginData);

      login(response.data.user); // ✅ Use response.data.user, not response.data

      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Incorrect email or password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setIsSubmitting(false);
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const password = registerData.password;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!isLongEnough || !hasUpperCase || !hasSpecialChar) {
      setIsSubmitting(false);
      toast({
        title: "Password Strength",
        description: "For your security, use at least 6 characters, one uppercase letter, and one special character.",
        variant: "destructive",
      });
      return;
    }

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setIsSubmitting(false);
      toast({
        title: "Input Required",
        description: "Please complete all fields to create your account.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setIsSubmitting(false);
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure both password fields are identical.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post(`/api/auth/signup`, registerData);

      login(response.data.user);

      toast({
        title: "Account Created!",
        description: "Your account has been successfully registered. Welcome to Homodeal!",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.error || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary">Homodeal</span>
          </div>
          <p className="text-gray-600">Your gateway to perfect properties</p>
        </div>

        {/* Auth Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                <GoogleLogin
                  onSuccess={async(credentialResponse) => {
                    try {
                      const res = await api.post("/api/auth/google", {
                      idToken: credentialResponse.credential, 
                    });
                    login(res.data.user);
                    toast({
                      title: "Welcome Back!",
                      description: "You have successfully logged in.",
                    });
                    navigate("/dashboard");
                    } catch (error: any) {
                      toast({
                        title: "Authentication Failed",
                        description: "Unable to sign in with Google. Please try again.",
                        variant: "destructive",
                      });
                    }}
                  }
                  onError={() => {
                  toast({
                    title: "Authentication Cancelled",
                    description: "Google sign-in was interrupted. Please try again.",
                    variant: "destructive",
                  });
                }}
              />


                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging you in..." : "Log in"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join Homodeal and start your property journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                <GoogleLogin
                  onSuccess={async(credentialResponse) => {
                    try {
                      const res = await api.post("/api/auth/google", {
                      idToken: credentialResponse.credential, 
                    });
                    login(res.data.user);
                    toast({
                      title: "Welcome Back!",
                      description: "You have successfully logged in.",
                    });
                    navigate("/dashboard");
                    } catch (error: any) {
                      toast({
                        title: "Authentication Failed",
                        description: "Unable to sign in with Google. Please try again.",
                        variant: "destructive",
                      });
                    }}
                  }
                  onError={() => {
                  toast({
                    title: "Authentication Cancelled",
                    description: "Google sign-in was interrupted. Please try again.",
                    variant: "destructive",
                  });
                }}
              />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Creating your account..."
                      : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;

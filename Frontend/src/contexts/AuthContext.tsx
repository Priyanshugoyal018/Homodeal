import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import GlobalLoader from "@/components/GlobalLoader";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setCurrentUser(null);
    navigate("/auth");
    toast({
      title: "Session Expired",
      description: "Please login again.",
    });
  }, [navigate, toast]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const checkAuth = useCallback(async () => {
    if (window.location.pathname.startsWith("/auth")) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/auth/me");
      setCurrentUser(res.data.user);
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("logout", logout);
    return () => window.removeEventListener("logout", logout);
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAdmin = currentUser?.isAdmin === true || currentUser?.role === "admin";

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAdmin, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

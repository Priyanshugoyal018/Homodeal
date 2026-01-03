// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, logout } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        await api.get("/api/auth/me");
        setIsValidating(false);
      } catch {
        logout();
      }
    };

    if (currentUser) {
      validateSession();
    } else {
      setIsValidating(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (isValidating) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

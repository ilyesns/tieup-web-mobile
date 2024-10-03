import { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth_context";
import LoadingPage from "../components/Loading";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 2-second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading || isLoading) return <LoadingPage />; // Show loading page during the delay

  if (!isLoggedIn) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

import { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth_context";
import LoadingPage from "../components/Loading";

export const PrivateRoute = ({ children }) => {
  const { isLoggedIn, userRole, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 2-second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading || isLoading) return <LoadingPage />; // Show loading page during the delay
  if (!isLoggedIn || userRole !== "freelancer") {
    // user is not authenticated
    sessionStorage.setItem("showErrorMessage", "true");

    return <Navigate to="/home?error=access-denied" replace />;
  }

  return children;
};

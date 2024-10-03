import React from "react";
import { redirect, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { useAuth } from "./hooks/auth_context"; // Adjust path as needed
import { signOutUser } from "./firebase_auth/firebase_auth";
import { Login } from "./pages/Login";
import LoadingPage from "./components/Loading";

const ProtectedRoute = ({ Element }: { Element: any }) => {
  const { currentUser, isLoading, isLoggedIn } = useAuth(); // Access role from context

  if (isLoading) {
    return <LoadingPage />; // Show a loading spinner or similar
  }

  if (currentUser.typeUser === "ADMIN" && isLoggedIn) {
    return <>{Element}</>; // Access granted
  } else if (currentUser.typeUser === "USER") {
    signOutUser();
    return <Navigate to="/unauthorized" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }

  // Redirect if access is denied
};

export default ProtectedRoute;

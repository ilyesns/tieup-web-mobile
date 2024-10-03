// Import necessary dependencies
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase_config.js";
const { getUser } = require("../apis/user_api.ts");

// Create a context
const AuthContext = createContext({
  isLoading: true,
  isLoggedIn: false,
  userRole: null,
  currentUser: {
    userId: null,
    email: "",
    firstName: "",
    lastName: "",
    fullName: "",
    emailVerified: false,
    phoneNumber: "",
    role: "",
    joinDate: null,
    photoUrl: "",
    accessToken: "",
  },
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  // State variables
  const [currentUser, setCurrentUser] = useState({
    userId: null,
    email: "",
    firstName: "",
    lastName: "",
    fullName: "",
    emailVerified: false,
    phoneNumber: "",
    role: "",
    joinDate: null,
    photoUrl: "",
    accessToken: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Effect to set up authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(true);

      if (user) {
        setIsLoggedIn(true);

        if (!currentUser.userId) {
          user.getIdToken().then(async (accessToken) => {
            setCurrentUser({
              userId: user.uid,
              email: user.email || "",
              firstName: user.firstName || "",
              lastName: "",
              emailVerified: user.emailVerified || false,
              phoneNumber: user.phoneNumber || "",
              accessToken: accessToken || "",
            });
            setIsLoading(false);
          });
        }
      } else {
        setCurrentUser({
          userId: null,
          email: "",
          displayName: "",
          emailVerified: false,
          phoneNumber: "",
          photoUrl: "",
          accessToken: "",
        });
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser.userId) {
        const user = await getUser(currentUser.userId, currentUser.accessToken);
        setUserRole(user.role);
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [currentUser.accessToken, currentUser.userId]); // Dependency array includes values that affect the effect

  // Provider value
  const authContextValue = {
    currentUser,
    isLoading,
    isLoggedIn,
    userRole,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useContext hook
export const useAuth = () => {
  return useContext(AuthContext);
};

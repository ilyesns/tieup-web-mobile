import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "../config/firebase_config";
import { User } from "firebase/auth";
import { getUser } from "../api/users"; // Import your getUser function

interface AuthUser {
  userId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailVerified: boolean;
  phoneNumber: string;
  role: string;
  typeUser: string;
  joinDate: any;
  photoURL: string;
  accessToken: string;
}

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: AuthUser;
  userRole: string | null; // New field for role
}

const defaultUser: AuthUser = {
  userId: null,
  email: "",
  firstName: "",
  lastName: "",
  fullName: "",
  emailVerified: false,
  phoneNumber: "",
  role: "",
  typeUser: "",
  joinDate: null,
  photoURL: "",
  accessToken: "",
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  currentUser: defaultUser,
  userRole: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null); // New state for role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      setIsLoading(true);

      if (user) {
        const accessToken = await user.getIdToken();
        const userData = await getUser(user.uid, accessToken);
        setIsLoggedIn(true);
        setCurrentUser({
          userId: user.uid,
          email: user.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          fullName: `${userData.firstName} ${userData.lastName}` || "",
          emailVerified: user.emailVerified,
          phoneNumber: userData.phoneNumber || "",
          role: userData.role,
          typeUser: userData.typeUser,
          joinDate: userData.joinDate || null,
          photoURL: userData.photoURL || "",
          accessToken,
        });

        setUserRole(userData.role); // Set user role in context
        setIsLoading(false);
      } else {
        setCurrentUser(defaultUser);
        setIsLoading(false);
        setIsLoggedIn(false);

        setUserRole(null);
      }
    });

    return () => unsubscribe(); // Ensure proper cleanup
  }, []); // Ensure this runs once on component mount

  const authContextValue = {
    currentUser,
    isLoading,
    isLoggedIn,
    userRole, // Add to context
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

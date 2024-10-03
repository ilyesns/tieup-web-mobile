import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, app } from "../config/firebase_config";

// Sign up with email and password
const signUpWithEmailAndPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
const signInWithCredentials = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    return null;
  }
};

// Sign out
const signOutUser = () => {
  return signOut(auth);
};

// Reset password
const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// Google
const handleSendEmailVerification = async () => {
  const user = auth.currentUser;

  if (user) {
    await sendEmailVerification(user);
  }
};

// Sign in with Google
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const signInWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

export {
  signUpWithEmailAndPassword,
  signInWithCredentials,
  signOutUser,
  resetPassword,
  signInWithGoogle,
  handleSendEmailVerification,
  signInWithFacebook,
};

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
const signUpWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
const signInWithCredentials = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign out
const signOutUser = () => {
  return signOut(auth);
};

// Reset password
const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email).then(() => {
    alert("Email've been sent!");
  });
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

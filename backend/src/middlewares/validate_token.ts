import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase.config";
// Middleware function to validate Firebase token
interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const validateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  const token = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded token to the request object
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).send({ message: "Unauthorized" });
  }
};

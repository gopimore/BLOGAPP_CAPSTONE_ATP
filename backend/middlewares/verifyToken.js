import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {

      // DEBUG
      console.log("Cookies:", req.cookies);

      // Read token from cookie
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Please login",
        });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Check if role is allowed
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden. You don't have permission",
        });
      }

      // Attach user info to req
      req.user = decodedToken;

      next();

    } catch (err) {

      console.log("Verify token error:", err);

      // Token expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again",
        });
      }

      // Invalid token
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again",
        });
      }

      // Other server errors
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};
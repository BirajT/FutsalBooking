import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.utils.js";
import CustomError from "./error_handler.middleware.js";

const authenticate = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token;

      // ✅ 1. Read token from cookie (browser)
      if (req.cookies?.access_token) {
        token = req.cookies.access_token;
      }

      // ✅ 2. Read token from Authorization header (Postman / Mobile)
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      // ❌ No token
      if (!token) {
        throw new CustomError("Unauthorized. Access denied", 401);
      }

      // ✅ 3. Verify token (handles expiry automatically)
      const payload = verifyToken(token);

      // ✅ 4. Validate user
      const user = await User.findById(payload._id);
      if (!user) {
        throw new CustomError("Unauthorized. Access denied", 401);
      }

      // ✅ 5. Role check (safe)
      if (roles.length && !roles.includes(user.role)) {
        throw new CustomError("Forbidden. Access denied", 403);
      }

      // ✅ 6. Attach user
      req.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authenticate;

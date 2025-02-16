import { verifyJwt } from "../utils/jwtUtils.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const { username, userId } = verifyJwt(token);

    if (!username || !userId) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = { username: username, userId: userId };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default authMiddleware;

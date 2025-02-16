import express from "express";
import { login } from "../middleware/jwtMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Set up router from express Router
const router = express.Router();

router.post("/login", login);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});

export default router;

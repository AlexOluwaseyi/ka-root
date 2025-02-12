import express from "express";
import { authenticateToken } from "../middleware/auth.js";

// Import routers from routes
import UserRouter from "./userRoutes.js";
import QuizRouter from "./quizRoutes.js";
import OTPRouter from "./otpRoutes.js";

const router = express.Router();

router.use("/users", authenticateToken, UserRouter);
router.use("/quizzes", QuizRouter);
router.use("/otp", OTPRouter);

export default router;

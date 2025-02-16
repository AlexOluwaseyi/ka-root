import express from "express";

// Import routers from routes
import UserRouter from "./userRoutes.js";
import QuizRouter from "./quizRoutes.js";
import OTPRouter from "./otpRoutes.js";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/quizzes", QuizRouter);
router.use("/otp", OTPRouter);

export default router;

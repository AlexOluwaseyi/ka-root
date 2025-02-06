import express from "express";

// Import routers from routes
import UserRouter from "./userRoutes.js";
import QuizRouter from "./quizRoutes.js";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/quizzes", QuizRouter);

export default router;

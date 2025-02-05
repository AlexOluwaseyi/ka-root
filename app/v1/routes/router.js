import express from "express";

// Import routers from routes
import UserRouter from "../routes/userRoutes.js";
import QuizRouter from "../routes/quizRoutes.js";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/quizzes", QuizRouter);

export default router;

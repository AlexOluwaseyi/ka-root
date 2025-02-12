import { initDatabase } from "./app/v1/db/init.js";
import { User, Quiz, UserQuiz } from "./app/v1/models/index.js";
import bcrypt from "bcrypt";

const createTestData = async () => {
  try {
    // Initialize database
    await initDatabase();

    // Create a test user
    const hashedPassword = await bcrypt.hash("testPassword123", 10);
    const testUser = await User.create({
      fullName: "Test User",
      username: "testuser",
      email: "test@example.com",
      phone: "+1234567890",
      hashedPassword,
      verified: true,
    });
    console.log("Test user created:", testUser.toJSON());

    // Create some test quizzes
    const quizzes = await Quiz.bulkCreate([
      {
        question: "What is the capital of France?",
        category: "Geography",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
        flag: false,
      },
      {
        question: "Which planet is known as the Red Planet?",
        category: "Science",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
        flag: false,
      },
    ]);
    console.log(
      "Test quizzes created:",
      quizzes.map((quiz) => quiz.toJSON())
    );

    // Record quiz attempts for the user
    const userQuizAttempts = await UserQuiz.bulkCreate([
      {
        userId: testUser.userId,
        quizId: quizzes[0].quizId,
        score: 100,
        answers: {
          selectedAnswer: "Paris",
        },
        timeTaken: 30,
        status: "completed",
      },
      {
        userId: testUser.userId,
        quizId: quizzes[1].quizId,
        score: 0,
        answers: {
          selectedAnswer: "Venus",
        },
        timeTaken: 45,
        status: "completed",
      },
    ]);
    console.log(
      "Quiz attempts recorded:",
      userQuizAttempts.map((attempt) => attempt.toJSON())
    );

    // Fetch user with their quiz attempts
    const userWithQuizzes = await User.findOne({
      where: { email: "test@example.com" },
      include: [
        {
          model: Quiz,
          through: {
            attributes: ["score", "completedAt", "timeTaken"],
          },
        },
      ],
    });
    console.log("\nUser's quiz history:", userWithQuizzes.toJSON());
  } catch (error) {
    console.error("Test data creation failed:", error);
  } finally {
    // Close database connection
    process.exit();
  }
};

// Run the test
createTestData();

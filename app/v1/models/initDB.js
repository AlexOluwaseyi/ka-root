import dotenv from "dotenv";
import { User, userSequelize } from "./userModel.js";
import { Quiz, quizSequelize } from "./quizModel.js";

// Load environment variables from .env file
dotenv.config();

// Validate database paths
if (!process.env.USERS_DB || !process.env.QUIZES_DB) {
  console.error("Failed to load database paths from environment variables.");
  process.exit(1);
}

// Initialize both databases
export const initDatabases = async () => {
  try {
    // Initialize user database
    await userSequelize.authenticate();
    console.log("Users database connected successfully.");
    await userSequelize.sync({ alter: true });
    console.log("Users database synchronized successfully.");

    // Initialize quiz database
    await quizSequelize.authenticate();
    console.log("Quiz database connected successfully.");
    await quizSequelize.sync({ alter: true });
    console.log("Quiz database synchronized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

// Export models and database instances
export { User, Quiz, userSequelize, quizSequelize };

import { sequelize } from "./config.js";
import { User } from "../models/userModel.js";
import { Quiz } from "../models/quizModel.js";
import { OTP } from "../models/otpModel.js";
import { UserQuiz } from "../models/userQuizModel.js";

export const initDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully.");

    return {
      User,
      Quiz,
      OTP,
      UserQuiz,
      sequelize,
    };
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

// Export models and sequelize instance
export { User, Quiz, OTP, UserQuiz, sequelize };

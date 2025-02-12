import { User } from "../models/userModel.js";
import { Quiz } from "../models/quizModel.js";

export const findUserByField = async (field, value) => {
  try {
    // Dynamically construct the where condition based on the field argument
    const currentUser = await User.findOne({
      where: {
        [field]: value, // Use the field dynamically
      },
    });

    if (!currentUser) {
      console.log(`${field} not found.`);
      return null;
    }
    return currentUser;
  } catch (error) {
    console.error(`Error finding user by ${field}:`, error.message);
    throw error;
  }
};

export const findUserByEmail = async (userEmail) => {
  const user = await findUserByField("email", userEmail);

  if (user) {
    return user;
  } else {
    throw new Error(`No user found with email: ${userEmail}`);
  }
};

export const findUserById = async (userId) => {
  const user = await findUserByField("id", userId);

  if (user) {
    return user;
  } else {
    throw new Error(`No user found with ID: ${userId}`);
  }
};

export const findQuizById = async (id) => {
  try {
    const currentQuiz = await Quiz.findOne({
      where: {
        id: id,
      },
    });

    if (!currentQuiz) {
      console.log("Quiz not found.");
      return null;
    }

    return currentQuiz;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw error;
  }
};

export const findQuizByCategory = async (category) => {
  try {
    const categoryQuiz = await Quiz.findAll({
      where: {
        category: category,
      },
    });

    if (categoryQuiz.length === 0) {
      console.log(`No quiz found found for ${category}`);
      return null;
    }

    return categoryQuiz;
  } catch (error) {
    console.error("Error finding quiz in category:", error.message);
    throw error;
  }
};

export const findFlaggedQuiz = async () => {
  try {
    const flaggedQuiz = await Quiz.findAll({
      where: {
        flag: true,
      },
    });

    if (flaggedQuiz.length === 0) {
      console.log("No flagged quiz found.");
      return null;
    }

    return flaggedQuiz;
  } catch (error) {
    console.error("Error finding flagged quiz:", error.message);
    throw error;
  }
};

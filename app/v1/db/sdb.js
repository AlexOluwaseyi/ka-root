import { initDatabases, User, Quiz } from "../models/initDB.js";
import { checkPassword, hashPassword } from "../services/auth.service.js";
import {
  findQuizById,
  findUserByEmail,
  findUserById,
  findFlaggedQuiz,
} from "../utils/dbUtils.js";

// await initDatabases();
// const createUser = async () => {
//   const hashedpassword = await hashPassword("development");
//   const user = await User.create({
//     name: "Rosbaaods Joy",
//     email: "akinsfgdft@def.com",
//     hashedPassword: hashedpassword,
//   });
// };

// const newQuiz = await Quiz.create({
//   question: "Rosbaaods Joy",
//   category: "IT",
//   options: { a: "two", b: "Four" },
//   answer: "two",
// });

// console.log(user.toJSON());
// createUser();
// console.log(newQuiz.toJSON());

// console.log(checkPassword)

// const checkUser = async () => {
//   console.log("Checking password now.");
//   const user = { id: "2d01faf0-652e-4be6-9399-20e2714fc2ff" };
//   const passwordResult = await checkPassword(user, "development");
//   console.log(passwordResult);
// };
// checkUser();

const checkUserByEmail = async () => {
  try {
    const email = "akinsfgdft@def.com";
    const user = await findUserByEmail(email);
    console.log("User found:", user);
  } catch (error) {
    console.log(error.message); // Handle the error (e.g., "No user found with email")
  }
};

const checkUserById = async () => {
  try {
    const userId = "2d01faf0-652e-4be6-9399-20e2714fc2ff";
    const user = await findUserById(userId);
    console.log("User found:", user);
  } catch (error) {
    console.log(error.message); // Handle the error (e.g., "No user found with ID")
  }
};
const checkQuizById = async () => {
  try {
    const quizId = "2b0083fd-6e67-48d9-b818-d58e553b9f8e";
    const user = await findQuizById(quizId);
    console.log("Quiz found:", user);
  } catch (error) {
    console.log(error.message); // Handle the error (e.g., "No user found with ID")
  }
};
const checkFlaggedQuiz = async () => {
  try {
    const user = await findFlaggedQuiz();
    console.log("Quiz found:", user);
  } catch (error) {
    console.log(error.message); // Handle the error (e.g., "No user found with ID")
  }
};

// checkUserByEmail();
// checkUserById();
// checkQuizById();
checkFlaggedQuiz();

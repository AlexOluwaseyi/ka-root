import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Set up router from express Router
const router = express.Router();

/**
 * Set up mock questions from json files
 */
// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic path for the JSON file
const __filepath = path.join(__dirname, "../../../mock/quiz.json");

let QuizBank = {};

// Read the file synchronously and parse JSON
try {
  const fileContent = fs.readFileSync(__filepath, "utf-8");
  QuizBank = JSON.parse(fileContent);
} catch (error) {
  console.error("Error reading or parsing quiz.json:", error.message);
}

/**
 * Quiz routes starts here
 *
 */
// Get all quizzes
router.get("/", (req, res) => {
  res.json(QuizBank);
});

// Get all categories with the number of questions in each category
router.get("/category2", (req, res) => {
  console.log("Fetching categories with question counts...");

  // Create a map to store categories and their question counts
  const categoryCounts = {};

  for (const quizId in QuizBank) {
    if (QuizBank.hasOwnProperty(quizId)) {
      const question = QuizBank[quizId];
      const category = question.category;

      // Increment the count for the category or initialize it
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }

  // Convert the categoryCounts object into an array of objects
  const response = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  res.json(response);
});


// Get all categories
router.get("/category", (req, res) => {
  console.log("In here");
  //   const QuizCategories = [];
  const QuizCategories = new Set();
  for (const quiz in QuizBank) {
    if (QuizBank.hasOwnProperty(quiz)) {
      const question = QuizBank[quiz];
      QuizCategories.add(question.category);
    }
  }
  res.send(Array.from(QuizCategories));
});

// Get quizzes in category
router.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const categoryQuiz = [];

  //   Loop through the QuizBank and filter by category
  for (const quiz in QuizBank) {
    if (QuizBank.hasOwnProperty(quiz)) {
      const question = QuizBank[quiz];
      if (question.category.toLowerCase() === category) {
        categoryQuiz.push(question);
      }
    }
  }

  if (categoryQuiz.length == 0) {
    res.json({ error: `No questions in ${category} category yet.` });
  }
  res.send(categoryQuiz);
});
// Get quiz by ID
router.get("/:id", (req, res) => {
  const quizId = req.params.id;
  const quizById = QuizBank[quizId];
  if (!quizById) {
    return res.status(404).send({ error: "Quiz not found" });
  }
  res.json(quizById);
});

// Get quiz components (questions, options, answers, etc)
router.get("/:id/:property", (req, res) => {
  const quizId = req.params.id;
  const property = req.params.property;

  console.log(property);

  const quizById = QuizBank[quizId];
  if (!quizById) {
    return res.status(404).send({ error: "Quiz not found" });
  }

  // Validate property and ensure the key exists in the quiz object
  if (!quizById.hasOwnProperty(property)) {
    return res.status(400).send({ error: "Invalid property key" });
  }
  const response = quizById[property];
  res.send({ [property]: response });
});

export default router;

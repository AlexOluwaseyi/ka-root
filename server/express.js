// const express = require("express");
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const app = express();
const port = 3000;

// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic path for the JSON file
const __filepath = path.join(__dirname, "../mock/quiz.json");

// Logging
morgan.format(
  "customFormat",
  '[:date[web]] :method :url :status :res[content-length] ":user-agent"'
);
app.use(morgan("customFormat"));
/**
 * // Write log to file (Optional)
 * const accessLogStream = fs.createWriteStream(
 *   path.resolve(__dirname, "access.log"),
 *   { flags: "a" }
 *  );
 *  app.use(morgan("customFormat", { stream: accessLogStream }));
 */

let QuizBank = {};

app.use(express.json());

// Read the file synchronously and parse JSON
try {
  const fileContent = fs.readFileSync(__filepath, "utf-8");
  QuizBank = JSON.parse(fileContent);
} catch (error) {
  console.error("Error reading or parsing quiz.json:", error.message);
}

/**
 * App routes starts here
 *
 */

// Get Home or root
app.get("/", (req, res) => {
  res.send("Welcome to Ka-Root!");
});

// Get all quizes
app.get("/allquiz", (req, res) => {
  res.json(QuizBank);
});

// Get quiz by ID
app.get("/quiz/:id", (req, res) => {
  const quizId = req.params.id;
  const quizById = QuizBank[quizId];
  if (!quizById) {
    return res.status(404).send({ error: "Quiz not found" });
  }
  res.json(quizById);
});

// Get all categories
app.get("/category", (req, res) => {
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

// Get quizes in category
app.get("/category/:category", (req, res) => {
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

// Get quiz components (questions, options, answers, etc)
app.get("/quiz/:id/:query", (req, res) => {
  const quizId = req.params.id;
  const query = req.params.query;

  console.log(query);

  const quizById = QuizBank[quizId];
  if (!quizById) {
    return res.status(404).send({ error: "Quiz not found" });
  }

  // Validate query and ensure the key exists in the quiz object
  if (!quizById.hasOwnProperty(query)) {
    return res.status(400).send({ error: "Invalid query key" });
  }
  const response = quizById[query];
  res.send({ [query]: response });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from "express";

// Set up router from express Router
const router = express.Router();

/**
 * Quiz routes starts here
 *
 */
// Get all quizes
router.get("/quizes", (req, res) => {
  res.json(QuizBank);
});

// Get quiz by ID
router.get("/quizes/:id", (req, res) => {
  const quizId = req.params.id;
  const quizById = QuizBank[quizId];
  if (!quizById) {
    return res.status(404).send({ error: "Quiz not found" });
  }
  res.json(quizById);
});

// Get all categories
router.get("/quizes/category", (req, res) => {
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
router.get("quizes/category/:category", (req, res) => {
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
router.get("/quizes/:id/:query", (req, res) => {
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

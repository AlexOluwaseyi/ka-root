import Quiz from "../models/quizModel.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;
    const quiz = await Quiz.create({ category, question, options, answer });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    quiz.category = category;
    quiz.question = question;
    quiz.options = options;
    quiz.answer = answer;
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    await quiz.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // import { Quiz, initQuizDatabase } from "../models/quizModel.js";
// import Quiz from "../models/quizModel.js";

// // (async () => {
// //   await initQuizDatabase();
// //   const newQuiz = await Quiz.create({
// //     name: "Rosbaaods Joy",
// //     email: "akinsfgdft@def.com",
// //   });
// //   console.log(newQuiz.toJSON());
// // })();

// // const newQuiz = await Quiz.create({
// //   question: "Rosbaaods Joy",
// //   category: "IT",
// //   options: { a: "two", b: "Four" },
// //   answer: "two",
// // });
// // console.log(newQuiz.toJSON());

// const question = "Rosbaaods Joy";
// const category = "IT";
// const options = { a: "two", b: "Four" };
// const answer = "two";

// const createQuiz = async (req, res) => {
//   try {
//     // const { category, question, options, answer } = req.body;
//     const quiz = await Quiz.create({ category, question, options, answer });
//     res.status(201).json(quiz);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// createQuiz();


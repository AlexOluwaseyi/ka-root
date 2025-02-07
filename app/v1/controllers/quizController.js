import Quiz from "../models/quizModel.js";
import User from "../models/userModel.js";

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

// Flag a quiz
export const flagQuiz = async (req, res) => {
  try {
    const { flag } = req.body;
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    if (flag) {
      quiz.flag = flag;
    }
    await quiz.save();
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

// Check answer to a quiz
export const checkQuizAnswer = async (req, res) => {
  try {
    const { selectedChoice } = req.body;
    if (!selectedChoice) {
      return res
        .status(400)
        .json({ error: "Answer not submitted successfully." });
    }
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).jspm({ error: "Quiz not found" });
    }
    if (quiz.answer === selectedChoice) {
      const player = await User.findByPk(req.params.id);
      if (!player) {
        return res.status(404).json({ error: "User not found" });
      }
      player.quizCount += 1;
      player.currentScore += 1;
      await player.save();
    }
    return res.status(200).json({ success: "Answer submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.messages });
  }
};

// Quit game (save player score in game history)
export const quitGame = async (req, res) => {
  try {
    const player = await User.findByPk(req.params.id);
  } catch (error) {
    res.status(500).json({ error: error.messages });
  }
};

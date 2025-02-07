import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get DB_PATH from environment variables
const quizDB = process.env.QUIZES_DB;

// Validate that USER_DB is defined
if (!quizDB) {
  console.error("Failed to load database from file.");
  process.exit(1);
}

// Initialize Sequelize with SQLite
const quizSequelize = new Sequelize({
  dialect: "sqlite",
  storage: quizDB,
  logging: false,
  // logging: console.log, // Logs SQL queries for debugging
});

export const Quiz = quizSequelize.define(
  "quiz",
  {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "quiz",
  }
);

export { quizSequelize };

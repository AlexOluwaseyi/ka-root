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
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: quizDB,
  logging: console.log, // Logs SQL queries for debugging
});

export const Quiz = sequelize.define(
  "quizes",
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      defaultValue: uuidv4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    history: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "users",
  }
);

// Function to initialize the database
export const initQuizDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync(); // Synchronize models with the database
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1); // Exit the process if database connection fails
  }
};

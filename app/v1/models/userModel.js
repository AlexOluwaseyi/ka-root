import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get DB_PATH from environment variables
const userDB = process.env.USERS_DB;

// Validate that USER_DB is defined
if (!userDB) {
  console.error("Failed to load database from file.");
  process.exit(1);
}

// Initialize Sequelize with SQLite
const userSequelize = new Sequelize({
  dialect: "sqlite",
  storage: userDB,
  logging: false,
  // logging: console.log,
});

export const User = userSequelize.define(
  "user",
  {
    fullName: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    history: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    quizCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currentScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
  }
);

// // Function to initialize the database
// export const initDb = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected successfully.");
//     await sequelize.sync(); // Synchronize models with the database
//     console.log("Database synchronized successfully.");
//   } catch (error) {
//     console.error("Database initialization failed:", error.message);
//     process.exit(1); // Exit the process if database connection fails
//   }
// };

export { userSequelize };

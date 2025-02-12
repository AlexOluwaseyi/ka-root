import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";
import { User } from "./userModel.js";
import { Quiz } from "./quizModel.js";
import { v4 as uuidv4 } from "uuid";

export const UserQuiz = sequelize.define(
  "user_quiz",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    quizId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Quiz,
        key: "quizId",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    answers: {
      type: DataTypes.JSON,
      defaultValue: {}, // Store user's answers for review
    },
    timeTaken: {
      type: DataTypes.INTEGER, // Time taken in seconds
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("completed", "in-progress", "abandoned"),
      defaultValue: "completed",
    },
  },
  {
    tableName: "user_quizzes",
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["quizId"],
      },
    ],
  }
);

// Define relationships
User.belongsToMany(Quiz, {
  through: UserQuiz,
  foreignKey: "userId",
});

Quiz.belongsToMany(User, {
  through: UserQuiz,
  foreignKey: "quizId",
});

// Direct relationships for easier querying
UserQuiz.belongsTo(User, { foreignKey: "userId" });
UserQuiz.belongsTo(Quiz, { foreignKey: "quizId" });

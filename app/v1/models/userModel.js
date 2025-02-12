import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../db/config.js";

export const User = sequelize.define(
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
    userId: {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

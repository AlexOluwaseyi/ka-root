import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Ensure the DB directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, "../db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(dbDir, "db.sqlite"),
  logging: console.log, // Logs SQL queries for debugging
});

const User = sequelize.define(
  "user",
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

await sequelize.sync();

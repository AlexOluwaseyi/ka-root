import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_PATH;

if (!dbPath) {
  console.error("Failed to load database path from environment variables.");
  process.exit(1);
}

// Single database instance for all models
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

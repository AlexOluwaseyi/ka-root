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
      // unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    history: {
      type: DataTypes.JSON,
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

// (async () => {
//   try {
//     // Sync the database
//     console.log("Syncing database...");
//     await sequelize.sync(); // Use { force: true } if necessary
//     console.log("Database synced!");

//     // Check tables in the database
//     const [tables] = await sequelize.query(
//       "SELECT name FROM sqlite_master WHERE type='table';"
//     );
//     console.log("Tables in database:", tables);

//     // Create a new user
//     console.log("Creating a new user...");
//     const newUser = await User.create({
//       name: "Rosbaaods Joy",
//       email: "abssead@def.com",
//     });
//     console.log("User created:", newUser.toJSON());
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();

export default User;

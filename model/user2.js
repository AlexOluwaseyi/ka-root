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
  storage: path.resolve(dbDir, "db.sqlite"), // Absolute path to SQLite database
  logging: console.log, // Logs SQL queries for debugging
});

(async () => {
  try {
    // Run raw SQL to create the users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        history JSON,
        rank INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sequelize.query(createTableQuery);
    console.log("Table 'users' created (if it didn't exist)");

    // Define the User model (for other operations like inserting data)
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
          unique: false,
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
    // Create a new user
    console.log("Creating a new user...");
    const newUser = await User.create({
      name: "Rosbaaods Joy",
      email: "abacssd@def.com",
    });
    console.log("User created:", newUser.toJSON());
  } catch (error) {
    console.error("Error:", error);
  }
})();

// (async () => {
//   try {
//     // Sync the database
//     console.log("Syncing database...");
//     await sequelize.sync({ force: true }); // Use { force: true } if necessary
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
//       email: "abacssead@def.com",
//     });
//     console.log("User created:", newUser.toJSON());
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();

// export default User;

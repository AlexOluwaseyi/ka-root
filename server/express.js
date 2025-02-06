import express from "express";
import router from "../app/v1/routers/router.js";
import morgan from "morgan";
const app = express();
const port = 3000;

// Logging
morgan.format(
  "customFormat",
  '[:date[web]] :method :url :status :res[content-length] ":user-agent"'
);
app.use(morgan("customFormat"));
/**
 * // Write log to file (Optional)
 * const accessLogStream = fs.createWriteStream(
 *   path.resolve(__dirname, "access.log"),
 *   { flags: "a" }
 *  );
 *  app.use(morgan("customFormat", { stream: accessLogStream }));
 */

// Get Home or root
app.get("/", (req, res) => {
  res.send("Welcome to Ka-Root!");
});

// Define routes
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

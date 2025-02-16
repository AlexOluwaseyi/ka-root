import express from "express";
import router from "../app/v1/routers/router.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

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

app.use(express.json());

// Parse JSON request bodies
// app.use(bodyParser.json());

// Parse URL-encoded data (from forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Define routes
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

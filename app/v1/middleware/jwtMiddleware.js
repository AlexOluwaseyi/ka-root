import { signJwt, verifyJwt } from "../utils/jwtUtils.js";
import { findUserByEmail, findUserByUsername } from "../utils/dbUtils.js";
import { checkPassword } from "../utils/utils.js";
import isEmail from "validator/lib/isEmail.js";

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new Error("Username or email and password required.");
    }

    // Determine if the identifier is an email or a username
    const email = isEmail(identifier) ? identifier : null;
    const username = !isEmail(identifier) ? identifier : null;

    // Find user by email or username
    const user = email
      ? await findUserByEmail(email)
      : await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if password is correct
    const passwordCheck = checkPassword(user, password);
    if (!passwordCheck) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    console.log("Sign in successful.");

    // Generate token
    const token = signJwt({ userId: user.userId, username: user.username });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Only secure in production
      //   sameSite: "Strict",
      maxAge: 10 * 60 * 1000,
    });

    return (
      res
        .status(200)
        //   .json({ message: "Login successful", userId: user.userId });
        .json({
          message: "Login successful",
          userId: user.userId,
          token: token,
        })
    );
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

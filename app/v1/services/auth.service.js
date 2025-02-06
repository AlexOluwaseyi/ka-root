import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { findUserByEmail, findUserById } from "../utils/utilsDb.js";

const saltRounds = 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error.message);
    throw new Error("Password hashing failed.");
  }
};

export const checkPassword = async (user, password) => {
  try {
    const currentUser = await findUserById(user.uid);
    if (!currentUser) {
      throw new Error("User not found.");
    }
    const match = await bcrypt.compare(password, currentUser.hashedPassword);
    return match;
  } catch (error) {
    console.error("Error checking password", error.message);
    throw new Error("Password verification failed.");
  }
};

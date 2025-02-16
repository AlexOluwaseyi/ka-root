import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "./dbUtils.js";

dotenv.config();

const jwtToken = process.env.JWT_TOKEN;

export const signJwt = (payload) => {
  try {
    // if (!userId) {
    //   throw new Error("User ID not found");
    // }

    // const user = findUserById(userId);

    // if (!user) {
    //   throw new Error("User not found");
    // }
    console.log("Generating token....");

    const token = jwt.sign(payload, jwtToken, {
      expiresIn: "5m",
    });
    return token;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

export const verifyJwt = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required.");
    }
    const decodedUser = jwt.verify(token, jwtToken);

    return decodedUser;

  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

import bcrypt from "bcrypt";
import { findUserById } from "../utils/dbUtils.js";
import dotenv from "dotenv";
import crypto from "crypto";
import { Op } from "sequelize";

dotenv.config();

const saltRounds = process.env.saltRounds;

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
    throw new Error("Password check failed.");
  }
};

// Generate OTP verification code
export const generateOTP = (req, res, next) => {
  try {
    return crypto.randomInt(100000, 999999).toString();
    // return otp;
  } catch (error) {
    throw new Error("OTP Generation failed.");
  }
};

// Verify if OTP is valid and not expired
export const isValidOTP = async (identifier, userOTP) => {
  try {
    // Find user by email or phone
    const user = await User.findOne({
      where: {
        userId: identifier,
      },
    });

    if (!user) {
      return { isValid: false, message: "User not found" };
    }

    // Find the latest unused OTP for this user
    const otpRecord = await OTP.findOne({
      where: {
        userId: user.userId,
        isUsed: false,
        expiryTime: {
          [Op.gt]: new Date(), // Check if not expired
        },
      },
      order: [["createdAt", "DESC"]], // Get the most recent OTP
    });

    if (!otpRecord) {
      return { isValid: false, message: "OTP not found or expired" };
    }

    // Check if OTP matches
    if (otpRecord.OTP !== userOTP) {
      return { isValid: false, message: "Invalid OTP" };
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    return {
      isValid: true,
      message: "OTP verified successfully",
      user, // Return user object for further use
    };
  } catch (error) {
    console.error("OTP validation error:", error);
    throw new Error({ isValid: false, message: "OTP verification failed" });
  }
};

export const veriftyOTP = () => {
  try {
  } catch (error) {
    throw new Error("OTP verification failed.");
  }
};

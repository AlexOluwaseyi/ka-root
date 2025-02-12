// middleware/auth.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { hashOTP, checkOTP, validateOTPStatus } from "../utils/utils.js";
import { findUserById } from "../utils/dbUtils.js";
import { User } from "../models/userModel.js";
import { sendEmailOTP, sendMailtrapOTP } from "../utils/utils.js";

dotenv.config();

const secretKey = process.env.JWT_TOKEN;
const OTP_EXPIRY = 5 * 60 * 1000;

export const authenticateToken = (req, res, next) => {
  // const token = req.headeprs["authorization"]?.split(" ")[1]; // Extract the Bearer token
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required. Token not provided." });
  }

  try {
    // Verify the token
    const decoderUser = jwt.verify(token, secretKey);
    req.user = decoderUser;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const generateUserOTP = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { plainOTP, hashedOTP } = await hashOTP();

    await user.update({
      updatedAt: new Date().toISOString(),
      hashedOTP: {
        OTP: hashedOTP,
        attempts: 0,
        createdAt: new Date().toISOString(),
        expiredAt: new Date(Date.now() + OTP_EXPIRY).toISOString(),
      },
    });

    await user.save();

    const mail = await sendMailtrapOTP(user.email, plainOTP);
    return {
      success: true,
      message: "OTP generated successfully",
      plainOTP: plainOTP,
      Mail: mail,
    };
  } catch (error) {
    console.error("OTP generation error:", error);
    throw new Error("Failed to generate OTP");
  }
};

export const verifyUserOTP = async (userId, OTP) => {
  try {
    if (!userId || !OTP) {
      throw new Error("User ID and OTP are required.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.hashedOTP || !user.hashedOTP.OTP) {
      throw new Error("No OTP found for user");
    }

    const verificationResult = await checkOTP(user, OTP);
    console.log(verificationResult);
    if (!verificationResult) {
      await user.update({
        hashedOTP: {
          ...user.hashedOTP,
          attempts: (user.hashedOTP.attempts || 0) + 1,
        },
      });

      throw new Error("Invalid OTP");
    }

    await user.update({
      isVerified: true,
      updatedAt: new Date().toISOString(),
      hashedOTP: {
        OTP: null,
        attempts: 0,
        createdAt: null,
        expiredAt: null,
        updatedAt: null,
      },
    });
    return {
      success: true,
      message: "OTP verified successfully",
      status: "Success",
    };
  } catch (error) {
    throw new Error(`OTP verification failed: ${error.message}`);
  }
};

// // Middleware to generate and send OTP
// export const generateAndSendOTP = async (req, res, next) => {
//   try {
//     const { email, phone } = req.body;

//     if (!email && !phone) {
//       return res.status(400).json({
//         error: "Either email or phone is required",
//       });
//     }

//     const identifier = email || phone;
//     const otp = generateOTP();
//     storeOTP(identifier, otp);

//     if (email) {
//       await sendEmailOTP(email, otp);
//     } else {
//       await sendSMSOTP(phone, otp);
//     }

//     res.json({
//       message: `OTP sent successfully to ${identifier}`,
//       expiresIn: OTP_EXPIRY / 1000 + " seconds",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Middleware to verify OTP
// export const verifyOTP = async (req, res, next) => {
//   try {
//     const { identifier, otp } = req.body;

//     if (!identifier || !otp) {
//       return res.status(400).json({
//         error: "Identifier (email/phone) and OTP are required",
//       });
//     }

//     if (!isValidOTP(identifier, otp)) {
//       return res.status(400).json({
//         error: "Invalid or expired OTP",
//       });
//     }

//     // Clear the OTP after successful verification
//     otpStore.delete(identifier);

//     // Look up or create user
//     const [user] = await User.findOrCreate({
//       where: {
//         [identifier.includes("@") ? "email" : "phone"]: identifier,
//       },
//       defaults: {
//         name: "New User",
//         email: identifier.includes("@") ? identifier : null,
//         phone: identifier.includes("@") ? null : identifier,
//       },
//     });

//     // Add user to request object for further middleware
//     req.user = user;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

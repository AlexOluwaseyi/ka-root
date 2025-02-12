import bcrypt from "bcrypt";
import { findUserById } from "../utils/dbUtils.js";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
dotenv.config();

const saltRounds = parseInt(process.env.saltRounds);
const MAX_OTP_ATTEMPTS = 3;

// Nodemailer
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT);
const EMAIL_FROM = process.env.EMAIL_FROM;

// Nodemailer for Mailtrap
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT);
const MAILTRAP_FROM = process.env.MAILTRAP_FROM;

// Initialize Email transporter
const emailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  // secure: SMTP_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Avoid issues with self-signed certificates
  },
});

// // Verify transporter
// emailTransporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Transport Error:", error);
//   } else {
//     console.log(`${success}: SMTP Transporter is ready to send emails 🚀`);
//   }
// });

// Initialize Email transporter - Mailtrap
const mailtrapTransporter = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: MAILTRAP_PORT,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

// Verify mailtrap transporter
mailtrapTransporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Transport Error:", error);
  } else {
    console.log(`${success}: Mailtrap Transporter is ready to send emails 🚀`);
  }
});

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error.message);
    throw new Error("Password hashing failed.");
  }
};

export const checkPassword = async (user, password) => {
  try {
    const currentUser = await findUserById(user.userId);
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
export const hashOTP = async () => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedOTP = await bcrypt.hash(otp, salt);
    return { plainOTP: otp, hashedOTP };
  } catch (error) {
    throw new Error("OTP Generation failed.", error.message);
  }
};

// Validate OTP expiry and attempts
export const validateOTPStatus = async (otpData) => {
  const now = new Date();
  const expiredAt = new Date(otpData.expiredAt);

  if (now > expiredAt) {
    throw new Error("OTP has expired");
  }

  if (otpData.attempts >= MAX_OTP_ATTEMPTS) {
    throw new Error("Maximum OTP attempts exceeded");
  }
};

export const checkOTP = async (user, otp) => {
  try {
    try {
      await validateOTPStatus(user.hashedOTP);
    } catch (error) {
      console.error({ message: error.message });
      throw new Error(`${error.message}`);
    }

    const checkResult = await bcrypt.compare(otp, user.hashedOTP.OTP);
    return checkResult;
  } catch (error) {
    throw new Error(`OTP verification failed: ${error.message}`);
  }
};

// // Verify if OTP is valid and not expired
// export const isValidOTP = async (identifier, userOTP) => {
//   try {
//     // Find user by email or phone
//     const user = await User.findOne({
//       where: {
//         userId: identifier,
//       },
//     });

//     if (!user) {
//       return { isValid: false, message: "User not found" };
//     }

//     // Find the latest unused OTP for this user
//     const otpRecord = await OTP.findOne({
//       where: {
//         userId: user.userId,
//         isUsed: false,
//         expiryTime: {
//           [Op.gt]: new Date(), // Check if not expired
//         },
//       },
//       order: [["createdAt", "DESC"]], // Get the most recent OTP
//     });

//     if (!otpRecord) {
//       return { isValid: false, message: "OTP not found or expired" };
//     }

//     // Check if OTP matches
//     if (otpRecord.OTP !== userOTP) {
//       return { isValid: false, message: "Invalid OTP" };
//     }

//     // Mark OTP as used
//     await otpRecord.update({ isUsed: true });

//     return {
//       isValid: true,
//       message: "OTP verified successfully",
//       user, // Return user object for further use
//     };
//   } catch (error) {
//     console.error("OTP validation error:", error);
//     throw new Error({ isValid: false, message: "OTP verification failed" });
//   }
// };

// export const verifyOTP = () => {
//   try {
//   } catch (error) {
//     throw new Error("OTP verification failed.");
//   }
// };

export const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `Your Authentication OTP ${otp}`,
      text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Authentication OTP</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendMailtrapOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: MAILTRAP_FROM,
      to: email,
      subject: `Your Authentication OTP ${otp}`,
      text: `Your OTP is: ${otp}. This OTP will expire in 10 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Authentication OTP</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `,
    };

    const info = await mailtrapTransporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

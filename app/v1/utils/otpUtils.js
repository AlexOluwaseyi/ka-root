// middleware/auth.js
import dotenv from "dotenv";
import { hashOTP, checkOTP } from "../utils/utils.js";
import { findUserById } from "../utils/dbUtils.js";
import { sendEmailOTP, sendMailtrapOTP } from "../utils/utils.js";

dotenv.config();

const OTP_EXPIRY = 5 * 60 * 1000;

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
    const smtp = await sendEmailOTP(user.email, plainOTP);

    return {
      success: true,
      message: "OTP generated successfully",
      plainOTP: plainOTP,
      Mail: mail,
      SMTP: smtp,
    };
  } catch (error) {
    throw new Error(`${error.message}`);
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
    throw new Error(`${error.message}`);
  }
};

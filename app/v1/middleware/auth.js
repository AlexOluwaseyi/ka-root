// middleware/auth.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_TOKEN;

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

// Middleware to generate and send OTP
export const generateAndSendOTP = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        error: "Either email or phone is required",
      });
    }

    const identifier = email || phone;
    const otp = generateOTP();
    storeOTP(identifier, otp);

    if (email) {
      await sendEmailOTP(email, otp);
    } else {
      await sendSMSOTP(phone, otp);
    }

    res.json({
      message: `OTP sent successfully to ${identifier}`,
      expiresIn: OTP_EXPIRY / 1000 + " seconds",
    });
  } catch (error) {
    next(error);
  }
};

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

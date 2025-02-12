import express from "express";
import { generateOTP } from "../utils/utils.js";

const router = express.Router();

router.get("/generate", (req, res) => {
  console.log("Generating OTP");
  try {
    const otp = generateOTP();
    console.log(otp);
    return res
      .status(200)
      .send({ Success: "OTP generated successfully", OTP: `${otp}` });
  } catch (error) {
    console.error(error.message);
  }
});

export default router;

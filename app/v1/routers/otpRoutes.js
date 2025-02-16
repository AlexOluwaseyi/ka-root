import express from "express";
import { generateUserOTP, verifyUserOTP } from "../utils/otpUtils.js";

const router = express.Router();

router.get("/generate", async (req, res) => {
  try {
    const { userId } = req.body;
    // const { plainOTP } = await generateUserOTP(userId);
    const { plainOTP, Mail, SMTP } = await generateUserOTP(userId);
    return res.status(200).send({
      Success: "OTP generated successfully",
      OTP: `${plainOTP}`,
      Mail: Mail.message,
      SMTP: SMTP.message,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ Error: "OTP generated failed", Reason: `${error.message}` });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const { userId, OTP } = req.body;
    const verificationStatus = await verifyUserOTP(userId, OTP);
    const { status } = verificationStatus;
    return res
      .status(200)
      .send({ Success: "OTP generated successfully", Status: `${status}` });
  } catch (error) {
    console.error(error.message);
    return res.status(410).send({ Error: `${error.message}` });
  }
});

export default router;

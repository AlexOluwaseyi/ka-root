import express from "express";
// import { generateOTP } from "../utils/utils.js";
import { generateUserOTP, verifyUserOTP } from "../middleware/auth.js";
import { MongoTailableCursorError } from "mongodb";

const router = express.Router();

router.get("/generate", async (req, res) => {
  try {
    const { userId } = req.body;
    const { plainOTP, Mail } = await generateUserOTP(userId);
    // const { plainOTP } = otp;
    return res.status(200).send({
      Success: "OTP generated successfully",
      OTP: `${plainOTP}`,
      Mail: Mail.message,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(200)
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

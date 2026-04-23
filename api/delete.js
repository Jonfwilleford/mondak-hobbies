import crypto from "crypto";

export default function handler(req, res) {
  const challengeCode = req.query.challenge_code;

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  const endpoint = "https://mondak-hobbies.vercel.app/api/delete";

  const hash = crypto
    .createHash("sha256")
    .update(challengeCode + verificationToken + endpoint)
    .digest("hex");

  res.status(200).json({
    challengeResponse: hash
  });
}
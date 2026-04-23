import crypto from "crypto";

export default function handler(req, res) {
  const challengeCode = req.body?.challengeCode;
  const verificationToken = process.env.JonForrestBuildsMondakHobbies;
  const endpoint = "https://mondak-hobbies.vercel.app/api/delete";

  if (challengeCode) {
    const hash = crypto
      .createHash("sha256")
      .update(challengeCode + verificationToken + endpoint)
      .digest("hex");

    return res.status(200).json({
      challengeResponse: hash
    });
  }

  return res.status(200).json({ status: "ok" });
}
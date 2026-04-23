export default function handler(req, res) {
  return res.status(200).json({
    verificationToken: process.env.EBAY_VERIFICATION_TOKEN
  });
}
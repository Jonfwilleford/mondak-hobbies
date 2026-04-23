export default function handler(req, res) {
  // Log what eBay is sending (important for debugging)
  console.log("eBay delete request body:", req.body);

  // MUST explicitly handle request method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // MUST return valid JSON response
  return res.status(200).json({
    status: "received",
    timestamp: new Date().toISOString()
  });
}
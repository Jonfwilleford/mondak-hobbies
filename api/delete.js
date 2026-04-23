export default function handler(req, res) {
  if (req.method === "POST" || req.method === "GET") {
    return res.status(200).json({
      status: "received"
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
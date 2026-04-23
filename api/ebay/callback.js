export default async function handler(req, res) {
  const { code, error } = req.query;

  // If user denied access
  if (error) {
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  // If no code returned
  if (!code) {
    return res.status(400).send("No authorization code received from eBay.");
  }

  try {
    const tokenRes = await fetch(
      "https://api.ebay.com/identity/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization":
            "Basic " +
            Buffer.from(
              process.env.EBAY_CLIENT_ID +
                ":" +
                process.env.EBAY_CLIENT_SECRET
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri:
            "https://mondak-hobbies.vercel.app/api/ebay/callback",
        }),
      }
    );

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(500).json({
        message: "Token exchange failed",
        error: data,
      });
    }

    // ⚠️ IMPORTANT: store this somewhere real later
    console.log("EBAY TOKENS:", data);

    return res.status(200).json({
      message: "eBay OAuth successful",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error during OAuth callback.");
  }
}
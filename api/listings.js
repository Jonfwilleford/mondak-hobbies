export default async function handler(req, res) {
  try {
    // 1. GET ACCESS TOKEN
    const tokenRes = await fetch(
      "https://api.ebay.com/identity/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.EBAY_CLIENT_ID +
                ":" +
                process.env.EBAY_CLIENT_SECRET
            ).toString("base64"),
        },
        body:
          "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("OAuth failed: no access token");
    }

    // 2. Fetch listings
    const seller = "oblivioushaxton"; // eBay seller username

    const ebayRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=*&seller=${seller}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const data = await ebayRes.json();

    // 3. RETURN TO FRONTEND
    res.status(200).json(data.itemSummaries || []);
  } catch (err) {
    console.error("OAuth/Listings error:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}
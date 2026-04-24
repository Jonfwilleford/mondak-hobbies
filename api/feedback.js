export default async function handler(_req, res) {
  try {
    const tokenRes = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.EBAY_CLIENT_ID + ":" + process.env.EBAY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    });

    const { access_token } = await tokenRes.json();
    if (!access_token) throw new Error("No access token");

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<GetFeedbackRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <UserID>oblivioushaxton</UserID>
  <FeedbackType>FeedbackReceivedAsSeller</FeedbackType>
  <DetailLevel>ReturnAll</DetailLevel>
  <Pagination>
    <EntriesPerPage>25</EntriesPerPage>
    <PageNumber>1</PageNumber>
  </Pagination>
</GetFeedbackRequest>`;

    const fbRes = await fetch("https://api.ebay.com/ws/api.dll", {
      method: "POST",
      headers: {
        "X-EBAY-API-CALL-NAME": "GetFeedback",
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-IAF-TOKEN": access_token,
        "Content-Type": "text/xml",
      },
      body: xml,
    });

    const xmlText = await fbRes.text();

    const extract = (block, tag) => {
      const m = block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
      return m ? decodeXmlEntities(m[1].trim()) : "";
    };

    const decodeXmlEntities = (str) =>
      str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");

    const blocks = xmlText.match(/<FeedbackDetail>([\s\S]*?)<\/FeedbackDetail>/g) || [];

    const feedback = blocks
      .map((b) => ({
        comment: extract(b, "CommentText"),
        date: extract(b, "CommentTime"),
        rating: extract(b, "FeedbackRating"),
      }))
      .filter((f) => f.rating === "Positive" && f.comment.length > 10);

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(feedback);
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
}

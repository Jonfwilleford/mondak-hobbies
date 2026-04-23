const tokenRes = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization":
      "Basic " + Buffer.from(
        process.env.EBAY_CLIENT_ID + ":" + process.env.EBAY_CLIENT_SECRET
      ).toString("base64")
  },
  body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope"
});

const tokenData = await tokenRes.json();
const accessToken = tokenData.access_token;

const seller = "oblivioushaxton";

const res = await fetch(
  `https://api.ebay.com/buy/browse/v1/item_summary/search?q=*&seller=${seller}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);

const data = await res.json();

export default function handler(req, res) {
  res.status(200).json(data.itemSummaries || []);
}
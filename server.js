const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(express.static('public'));

app.get('/api/listings', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.ebay.com/buy/browse/v1/item_summary/search',
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_ACCESS_TOKEN}`
        },
        params: {
          q: 'sports cards',
          limit: 50
        }
      }
    );

    const items = response.data.itemSummaries || [];

    res.json({ items });

  } catch (err) {
    console.error('eBay fetch failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
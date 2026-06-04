# MonDak Hobbies

A custom e-commerce storefront for a collectibles and trading card shop, with a Node.js backend that integrates directly with the eBay API to pull live inventory.

**Live site:** [mondak-hobbies.vercel.app](https://mondak-hobbies.vercel.app)

## Overview

MonDak Hobbies is a full-stack site built to display a card shop's inventory by syncing with their existing eBay listings, so the owner doesn't have to maintain a separate catalog. The frontend is built with vanilla HTML, CSS, and JavaScript; the backend is a Node.js/Express server that handles authentication with eBay and serves listing data to the client.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Node.js, Express
- **API Integration:** eBay API with OAuth 2.0 authentication
- **Deployment:** Vercel (serverless functions for the API layer)

## Features

- **Live eBay inventory** — Listings are pulled from the shop's eBay account through the eBay API, so the storefront reflects current stock.
- **OAuth 2.0 token handling** — The server manages eBay's OAuth flow, requesting and refreshing access tokens so API calls stay authenticated without manual intervention.
- **Serverless API layer** — API routes run as Vercel serverless functions, keeping eBay credentials on the server side and out of the client.
- **Responsive storefront** — The frontend layout adapts across desktop and mobile.

## Project Structure

```
mondak-hobbies/
├── api/            # Serverless API routes (eBay integration, token handling)
├── public/         # Frontend — HTML, CSS, client-side JS
├── server.js       # Express server entry point
└── package.json    # Dependencies and scripts
```

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Jonfwilleford/mondak-hobbies.git
cd mondak-hobbies

# Install dependencies
npm install

# Add your eBay API credentials to a .env file
# (see Environment Variables below)

# Start the server
node server.js
```

## Environment Variables

The eBay integration requires API credentials. Create a `.env` file in the root with:

```
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
```

These are never committed to the repo — they're loaded at runtime on the server.

## Notes

This project was built as a real-world client storefront. The core engineering challenge was the eBay OAuth 2.0 flow: requesting tokens, handling expiry/refresh, and keeping credentials secure on the serverless backend while serving clean listing data to a lightweight vanilla-JS frontend.

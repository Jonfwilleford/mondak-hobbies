
     /* ----- Hamburger ----- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    /* ----- eBay Listings ----- */
    /*
     * HOW TO CONNECT YOUR EBAY STORE
     * ─────────────────────────────────────────────────────────────────────────
     * The eBay Browse API requires OAuth. There are two paths:
     *
     * PATH A – Backend proxy (recommended for production)
     *   1. Set up a small server (Node/Express, PHP, etc.) that holds your
     *      eBay App ID + Cert ID securely.
     *   2. Your server exchanges credentials for a client-credentials OAuth
     *      token and calls the eBay Browse API:
     *      GET https://api.ebay.com/buy/browse/v1/item_summary/search
     *          ?q=*&seller=YOUR_EBAY_USERNAME&limit=12
     *   3. Your server exposes a simple endpoint like /api/listings.
     *   4. Change LISTINGS_URL below to point to your server endpoint.
     *
     * PATH B – Quick demo with your existing localhost server
     *   Your script.js already fetches http://localhost:3000/api/listings.
     *   Just change LISTINGS_URL to that same URL.
     *
     * eBay Developer portal: https://developer.ebay.com/
     * ─────────────────────────────────────────────────────────────────────────
     */
    const LISTINGS_URL = 'http://localhost:3000/api/listings'; // ← change this
    const EBAY_STORE_URL = 'https://www.ebay.com/str/YOUR_STORE_NAME'; // ← change this

    async function loadListings() {
      const grid = document.getElementById('listingsGrid');

      try {
        const res = await fetch(LISTINGS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        /* Support two common response shapes */
        const items = data?.itemSummaries      // eBay Browse API
                   || data?.inventoryItems     // your existing API
                   || data?.items
                   || [];

        if (items.length === 0) {
          grid.innerHTML = '<div class="listings-status"><p>No listings found.</p></div>';
          return;
        }

        grid.innerHTML = '';
        items.slice(0, 12).forEach(item => {
          const title  = item.title || item.name || 'Untitled';
          const price  = item.price?.value
                      || item.currentBidPrice?.value
                      || item.sellingStatus?.currentPrice?.value
                      || 'N/A';
          const imgSrc = item.image?.imageUrl
                      || item.thumbnailImages?.[0]?.imageUrl
                      || item.imageUrl
                      || '';
          const url    = item.itemWebUrl || item.itemHref || '#';
          const cond   = item.condition || '';

          const card = document.createElement('div');
          card.className = 'listing-card';
          card.innerHTML = `
            <div class="listing-img-wrap">
              ${imgSrc ? `<img src="${imgSrc}" alt="${title}" loading="lazy" />` : ''}
              ${cond ? `<span class="listing-badge">${cond}</span>` : ''}
            </div>
            <div class="listing-body">
              <p class="listing-title">${title}</p>
              <p class="listing-price">$${price}</p>
              <a class="listing-buy" href="${url}" target="_blank" rel="noopener">
                Buy Now on eBay
              </a>
            </div>
          `;
          grid.appendChild(card);
        });

      } catch (err) {
        console.error('Listings error:', err);
        grid.innerHTML = `
          <div class="listings-status">
            <p>Could not load listings — check your server connection.</p>
          </div>`;
      }
    }

    loadListings();
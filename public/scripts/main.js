// -------------------------
// NAV / MOBILE MENU
// -------------------------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
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
}


// -------------------------
// CONFIG
// -------------------------
const LISTINGS_URL = '/api/listings';

const isHomePage = document.getElementById('listingsGrid');
const isProductsPage = document.getElementById('productsGrid');


// -------------------------
// FETCH EBAY LISTINGS (single source of truth)
// -------------------------
async function fetchListings() {
  try {
    const res = await fetch(LISTINGS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    return data?.itemSummaries
        || data?.inventoryItems
        || data?.items
        || [];

  } catch (err) {
    console.error('Listings fetch error:', err);
    return [];
  }
}


// -------------------------
// HOME PAGE RENDER (latest 5)
// -------------------------
async function loadHomeListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const items = await fetchListings();

  const latest = items.slice(0, 5);

  if (!latest.length) {
    grid.innerHTML = '<div class="listings-status"><p>No listings found.</p></div>';
    return;
  }

  grid.innerHTML = '';

  latest.forEach(item => {
    const card = document.createElement('div');
    card.className = 'listing-card';

    const title = item.title || 'Untitled';
    const price = item.price?.value || 'N/A';
    const img = item.image?.imageUrl || '';
    const url = item.itemWebUrl || '#';

    card.innerHTML = `
      <div class="listing-img-wrap">
        ${img ? `<img src="${img}" alt="${title}" loading="lazy">` : ''}
      </div>
      <div class="listing-body">
        <p class="listing-title">${title}</p>
        <p class="listing-price">$${price}</p>
        <a class="listing-buy" href="${url}" target="_blank">View</a>
      </div>
    `;

    grid.appendChild(card);
  });

  console.log("HOME LISTINGS LOADING")
}


// -------------------------
// SIMPLE SPORT DETECTION
// -------------------------
function detectSport(title) {
  const t = title.toLowerCase();

  if (t.includes('baseball') || t.includes('mlb')) return 'baseball';
  if (t.includes('basketball') || t.includes('nba')) return 'basketball';
  if (t.includes('football') || t.includes('nfl')) return 'football';
  if (t.includes('hockey') || t.includes('nhl')) return 'hockey';

  return 'other';
}


// -------------------------
// INIT (runs based on page)
// -------------------------
if (isHomePage) loadHomeListings();
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
}

// -------------------------
// PRODUCTS PAGE RENDER (all listings)
// -------------------------
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const items = await fetchListings();

  allCards = items.map(item => ({
    title: item.title || 'Untitled',
    price: item.price?.value || 'N/A',
    imgSrc: item.image?.imageUrl || '',
    url: item.itemWebUrl || '#',
    cond: item.condition || '',
    sport: detectSport(item.title || '')
  }));

  renderProducts(allCards);
}


// -------------------------
// PRODUCT RENDER
// -------------------------
function renderProducts(cards) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!cards.length) {
    grid.innerHTML = '<div class="empty-state"><p>No cards found.</p></div>';
    return;
  }

  grid.innerHTML = '';

  cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-img-wrap">
        ${c.imgSrc ? `<img src="${c.imgSrc}" alt="${c.title}">` : ''}
      </div>
      <div class="product-body">
        <p class="product-title">${c.title}</p>
        <p class="product-price">$${c.price}</p>
        <a href="${c.url}" target="_blank">View on eBay</a>
      </div>
    `;

    grid.appendChild(card);
  });
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
if (isProductsPage) loadProducts();
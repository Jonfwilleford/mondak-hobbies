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

    return Array.isArray(data) ? data : [];

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
// STATIC FALLBACK TESTIMONIALS
// -------------------------
const STATIC_TESTIMONIALS = [
  { comment: "Found a Shohei Ohtani rookie I'd been hunting for months. Great price, fast shipping, and exactly as described. MonDak is my go-to.", author: "Travis M., Billings MT" },
  { comment: "Sold a big lot of vintage cards and got more than I expected. The process was easy and honest. Highly recommend for buying or selling.", author: "Ryan K., Williston ND" },
  { comment: "Submitted cards for grading and the whole process was painless. They handled everything and kept me updated the whole way.", author: "Sarah L., Sidney MT" },
];

function renderTestimonialCard(comment, author) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';

  const stars = document.createElement('div');
  stars.className = 'testimonial-stars';
  stars.textContent = '★★★★★';

  const text = document.createElement('p');
  text.className = 'testimonial-text';
  text.textContent = `"${comment}"`;

  const byline = document.createElement('span');
  byline.className = 'testimonial-author';
  byline.textContent = `— ${author}`;

  card.appendChild(stars);
  card.appendChild(text);
  card.appendChild(byline);
  return card;
}

// -------------------------
// LOAD EBAY FEEDBACK
// -------------------------
async function loadTestimonials() {
  const grid = document.getElementById('testimonialsList');
  if (!grid) return;

  try {
    const res = await fetch('/api/feedback');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const items = await res.json();
    if (!Array.isArray(items) || !items.length) throw new Error('No feedback');

    const shown = items.slice(0, 6);
    grid.innerHTML = '';

    shown.forEach(item => {
      const date = item.date
        ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        : '';
      const author = `Verified eBay Buyer${date ? `, ${date}` : ''}`;
      grid.appendChild(renderTestimonialCard(item.comment, author));
    });
  } catch {
    grid.innerHTML = '';
    STATIC_TESTIMONIALS.forEach(({ comment, author }) => {
      grid.appendChild(renderTestimonialCard(comment, author));
    });
  }
}


// -------------------------
// INIT (runs based on page)
// -------------------------
if (isHomePage) {
  loadHomeListings();
  loadTestimonials();
}
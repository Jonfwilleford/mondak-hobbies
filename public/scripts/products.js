    /* ── Products page logic ── */
    //const LISTINGS_URL = 'http://localhost:3000/api/listings';

    async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const items = await fetchListings(); // from main.js

  allCards = items.map(item => ({
    title: item.title || 'Untitled',
    price: item.price?.value || 'N/A',
    imgSrc: item.image?.imageUrl || '',
    url: item.itemWebUrl || '#',
    cond: item.condition || '',
    sport: detectSport(item.title || '')
  }));

  renderCards(allCards);
}

    let allCards = [];

    function detectSport(title) {
      const t = title.toLowerCase();
      if (t.includes('baseball') || t.includes('mlb')) return 'baseball';
      if (t.includes('basketball') || t.includes('nba')) return 'basketball';
      if (t.includes('football') || t.includes('nfl')) return 'football';
      if (t.includes('hockey') || t.includes('nhl')) return 'hockey';
      return 'other';
    }

    function renderCards(cards) {
      const grid = document.getElementById('productsGrid');
      if (cards.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No cards match your search.</p></div>';
        return;
      }
      grid.innerHTML = '';
      cards.forEach(c => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.sport = c.sport;
        card.innerHTML = `
          <div class="product-img-wrap">
            ${c.imgSrc ? `<img src="${c.imgSrc}" alt="${c.title}" loading="lazy"/>` : ''}
            ${c.cond ? `<span class="product-badge${c.sold ? ' sold' : ''}">${c.cond}</span>` : ''}
          </div>
          <div class="product-body">
            <p class="product-sport">${c.sport !== 'other' ? c.sport : 'Sports Card'}</p>
            <p class="product-title">${c.title}</p>
            <p class="product-price">$${c.price}</p>
            <a class="product-buy${c.sold ? ' sold-btn' : ''}" href="${c.url}" target="_blank" rel="noopener">
              ${c.sold ? 'Sold' : 'Buy on eBay'}
            </a>
          </div>`;
        grid.appendChild(card);
      });
    }

    /* Filter pills */
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyFilters();
      });
    });

    /* Search */
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    function applyFilters() {
      const sport  = document.querySelector('.pill.active')?.dataset.filter || 'all';
      const query  = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allCards.filter(c => {
        const matchSport = sport === 'all' || (sport === 'graded' ? c.cond.toLowerCase().includes('graded') : c.sport === sport);
        const matchQuery = !query || c.title.toLowerCase().includes(query);
        return matchSport && matchQuery;
      });
      renderCards(filtered);
    }
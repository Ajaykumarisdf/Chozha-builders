/**
 * CHOZHA BUILDERS — WORK PHOTO GALLERY
 * Easily add your work images and descriptions below!
 */

// ===================================================================
// 📸 HOW TO ADD YOUR WORK IMAGES:
// Simply add a new entry to the GALLERY_ITEMS array below.
// Example:
//   {
//       title: "Your Project Name",
//       category: "structure", // options: "foundation", "structure", "finishing", "handover"
//       categoryLabel: "Structure",
//       image: "https://your-image-url.com/photo.jpg", // or local path "assets/filename.jpg"
//       desc: "Short description of the work completed"
//   },
// ===================================================================

// Currently empty: "Sites view are coming soon" placeholder is displayed.
// When you have project photos to showcase, add them to this array!
const GALLERY_ITEMS = [
    /*
    Example format:
    {
        id: 1,
        title: "Traditional G+1 House Key Handover",
        category: "handover", // options: "foundation", "structure", "finishing", "handover"
        categoryLabel: "Handover",
        image: "assets/your-photo.jpg",
        desc: "Key handover ceremony in Mayiladuthurai."
    }
    */
];

// Initialize Gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
});

function initGallery() {
    const grid = document.getElementById('gallery-grid');
    const filtersContainer = document.getElementById('gallery-filters');
    const placeholder = document.getElementById('gallery-placeholder');
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // If no images are configured yet, keep the "Sites View are Coming Soon" placeholder visible
    if (!GALLERY_ITEMS || GALLERY_ITEMS.length === 0) {
        if (placeholder) placeholder.style.display = 'block';
        if (grid) grid.style.display = 'none';
        if (filtersContainer) filtersContainer.style.display = 'none';
        return;
    }

    // When images are present:
    if (placeholder) placeholder.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (filtersContainer) filtersContainer.style.display = 'flex';

    let currentFilter = 'all';
    let currentFilteredItems = [...GALLERY_ITEMS];
    let activeLightboxIndex = 0;

    // Render items
    function renderGallery(filter = 'all') {
        if (!grid) return;
        grid.innerHTML = '';
        currentFilteredItems = filter === 'all' 
            ? GALLERY_ITEMS 
            : GALLERY_ITEMS.filter(item => item.category === filter);

        if (currentFilteredItems.length === 0) {
            grid.innerHTML = `
                <div class="gallery-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>Sites view are coming soon.</p>
                </div>
            `;
            return;
        }

        currentFilteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-item';
            card.setAttribute('data-category', item.category);
            card.innerHTML = `
                <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='assets/hero-poster.jpg'">
                <span class="gallery-item-category">${escapeHtml(item.categoryLabel || item.category)}</span>
                <div class="gallery-item-overlay">
                    <h3 class="gallery-item-title">${escapeHtml(item.title)}</h3>
                    <p class="gallery-item-desc">${escapeHtml(item.desc)}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                openLightbox(index);
            });

            grid.appendChild(card);
        });
    }

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderGallery(currentFilter);
        });
    });

    // Lightbox Controls
    function openLightbox(index) {
        if (!lightbox) return;
        activeLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = currentFilteredItems[activeLightboxIndex];
        if (!item || !lightboxImg) return;

        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxDesc) lightboxDesc.textContent = item.desc;
        if (lightboxCategory) lightboxCategory.textContent = item.categoryLabel || item.category;
    }

    function nextLightbox() {
        if (currentFilteredItems.length === 0) return;
        activeLightboxIndex = (activeLightboxIndex + 1) % currentFilteredItems.length;
        updateLightboxContent();
    }

    function prevLightbox() {
        if (currentFilteredItems.length === 0) return;
        activeLightboxIndex = (activeLightboxIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
        updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    // Initial render
    renderGallery('all');
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

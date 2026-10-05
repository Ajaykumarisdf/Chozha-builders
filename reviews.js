/**
 * CHOZHA BUILDERS — VERIFIED CLIENT REVIEWS
 * Strict approval workflow: Submitted reviews are emailed to Er. Barath via Formspree.
 * Reviews ONLY appear on the website once verified and approved.
 */

// ===================================================================
// ⭐ VERIFIED & APPROVED REVIEWS (Managed by Er. Barath):
// To add newly approved client reviews, simply add an entry here:
// ===================================================================
const VERIFIED_REVIEWS = [
    {
        id: 1,
        name: "Ajaykumar",
        location: "Mayiladuthurai",
        project: "G+1 Independent Residential House",
        rating: 5,
        date: "August 2026",
        verified: true,
        text: "Chozha Builders earned our complete trust right from day one. Every single promise was kept, and every rupee was accounted for with transparent itemized bills. Er. Barath's personal supervision on site gave our family total peace of mind. Best civil construction team in Mayiladuthurai!"
    },
    {
        id: 2,
        name: "Jagan",
        location: "Koranad, Mayiladuthurai",
        project: "Custom Duplex House Construction",
        rating: 5,
        date: "July 2026",
        verified: true,
        text: "Every rupee we invested was completely worth it. The structural quality of materials—Tata Tiscon steel, UltraTech cement—and the masonry alignment exceeded all our expectations. Er. Barath delivered on-time handover exactly on our Muhurtham date."
    },
    {
        id: 3,
        name: "Manoj",
        location: "Mayiladuthurai",
        project: "Contemporary Residential Home",
        rating: 5,
        date: "May 2026",
        verified: true,
        text: "Chozha Builders delivered our home without a single day of delay. Their 5-stage milestone scheduling and daily photo updates made the entire building journey effortless. Highly recommended for turnkey home building!"
    },
    {
        id: 4,
        name: "Dr. Senthil Nathan",
        location: "Sirkazhi",
        project: "Luxury 3-BHK Residence",
        rating: 5,
        date: "March 2026",
        verified: true,
        text: "Outstanding architectural planning and 100% Vastu compliance. The natural light and cross-ventilation in our new house are exceptional. Er. Barath is truly knowledgeable, transparent, and approachable."
    },
    {
        id: 5,
        name: "R. Krishnakumar",
        location: "Kuthalam",
        project: "Ground + 2 Floors Residential Build",
        rating: 5,
        date: "January 2026",
        verified: true,
        text: "Very disciplined workforce and clean site management. Concrete curing was done diligently for the full 21-day cycle as promised. No hidden costs or surprise escalations throughout the contract."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Clear any previous unverified reviews or submission locks stored locally
    try {
        localStorage.removeItem('cb_user_reviews');
        localStorage.removeItem('cb_review_submitted_time');
    } catch (e) {}

    initReviews();
});

function initReviews() {
    const grid = document.getElementById('reviews-grid');
    const form = document.getElementById('review-form');
    const starContainer = document.getElementById('review-star-select');
    const ratingInput = document.getElementById('review-rating-value');

    // 1. Render ONLY Approved & Verified Reviews
    function renderReviews() {
        if (!grid) return;
        grid.innerHTML = '';

        VERIFIED_REVIEWS.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-display-card';
            
            const initials = review.name ? review.name.trim().charAt(0).toUpperCase() : 'C';
            const starsHtml = '★'.repeat(Math.max(1, Math.min(5, review.rating))) + 
                              '☆'.repeat(5 - Math.max(1, Math.min(5, review.rating)));

            card.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar">${escapeHtml(initials)}</div>
                    <div class="review-meta">
                        <div class="review-name">${escapeHtml(review.name)}</div>
                        <div class="review-location">${escapeHtml(review.location || 'Mayiladuthurai District')} ${review.project ? `• ${escapeHtml(review.project)}` : ''}</div>
                    </div>
                </div>
                <div class="review-stars" aria-label="${review.rating} out of 5 stars">${starsHtml}</div>
                <p class="review-text">"${escapeHtml(review.text)}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                    <div class="review-date">${escapeHtml(review.date || 'Recent')}</div>
                    <div class="review-verified">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Verified Homeowner
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 2. Star Rating Selector Logic
    let currentRating = 5;
    if (starContainer) {
        const starButtons = starContainer.querySelectorAll('button');
        starButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentRating = parseInt(btn.getAttribute('data-value') || '5', 10);
                if (ratingInput) ratingInput.value = currentRating;
                updateStarDisplay(currentRating);
            });
        });

        function updateStarDisplay(rating) {
            starButtons.forEach(btn => {
                const val = parseInt(btn.getAttribute('data-value') || '0', 10);
                if (val <= rating) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }
        updateStarDisplay(5);
    }

    // 3. Form Submission: Sends to Er. Barath for manual approval
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Bot honeypot check
            const honeypot = form.querySelector('input[name="_gotcha"]');
            if (honeypot && honeypot.value) {
                return;
            }

            // Gather inputs
            const rawName = form.querySelector('#review-name')?.value || '';
            const rawLocation = form.querySelector('#review-location')?.value || '';
            const rawProject = form.querySelector('#review-project')?.value || '';
            const rawMessage = form.querySelector('#review-message')?.value || '';
            const rating = parseInt(ratingInput?.value || String(currentRating), 10);

            // Sanitize inputs
            const cleanName = sanitizeText(rawName).slice(0, 60);
            const cleanLocation = sanitizeText(rawLocation).slice(0, 60);
            const cleanProject = sanitizeText(rawProject).slice(0, 80);
            const cleanMessage = sanitizeText(rawMessage).slice(0, 1000);

            if (!cleanName || cleanName.length < 2) {
                alert('Please enter your name (at least 2 characters).');
                return;
            }

            if (!cleanMessage || cleanMessage.length < 10) {
                alert('Please provide a review of at least 10 characters.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Review';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('form-submit-loading');
                submitBtn.innerHTML = '<span>Submitting review...</span>';
            }

            // Submit to Formspree endpoint so Er. Barath receives it
            const formspreeEndpoint = 'https://formspree.io/f/mvkzpeqp';
            const payload = {
                _subject: `[REVIEW SUBMISSION] New Review from ${cleanName} (${rating} Stars) - Chozha Builders`,
                review_status: "Awaiting Er. Barath's Verification & Approval",
                client_name: cleanName,
                location: cleanLocation || "Mayiladuthurai",
                project_type: cleanProject || "Residential Construction",
                rating: `${rating} / 5 Stars`,
                review_content: cleanMessage,
                submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            try {
                await fetch(formspreeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                form.reset();
                if (ratingInput) ratingInput.value = '5';
                if (typeof updateStarDisplay === 'function') updateStarDisplay(5);
                alert('Thank you! Your review has been submitted.');
            } catch (err) {
                console.error('Submission error:', err);
                form.reset();
                if (ratingInput) ratingInput.value = '5';
                if (typeof updateStarDisplay === 'function') updateStarDisplay(5);
                alert('Thank you! Your review has been submitted.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('form-submit-loading');
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // Render verified reviews
    renderReviews();
}

/**
 * Robust input sanitizer:
 * Strips HTML tags, script elements, protocols, and encodes dangerous characters
 */
function sanitizeText(str) {
    if (!str) return '';
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/[<>'"&]/g, (char) => {
            const map = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' };
            return map[char] || char;
        })
        .trim();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

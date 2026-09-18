/* ============================================
   CHOZHA BUILDERS — INTERACTIVE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. SCROLL PROGRESS BAR & NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Progress bar width
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        // Navbar shadow
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ===== 2. MOBILE NAVIGATION =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== 3. ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 140;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });


    // ===== 4. INTERACTIVE CONSTRUCTION COST CALCULATOR =====
    const calcAreaSlider = document.getElementById('calc-area');
    const calcAreaVal = document.getElementById('calc-area-val');
    const pkgCards = document.querySelectorAll('.pkg-card');
    const floorBtns = document.querySelectorAll('.floor-btn');
    const calcTotalPrice = document.getElementById('calc-total-price');
    const calcTotalSub = document.getElementById('calc-total-sub');
    const bdCivil = document.getElementById('bd-civil');
    const bdFinishes = document.getElementById('bd-finishes');
    const bdMep = document.getElementById('bd-mep');
    const bdDesign = document.getElementById('bd-design');
    const calcWhatsAppBtn = document.getElementById('calc-whatsapp-btn');

    let currentRate = 2200;
    let currentPkgName = 'Premium';
    let currentFloors = 'Ground Floor';

    const formatRupees = (num) => {
        return '₹' + num.toLocaleString('en-IN');
    };

    const formatLakhs = (num) => {
        if (num >= 10000000) {
            return '₹' + (num / 10000000).toFixed(2) + ' Cr';
        }
        return '₹' + (num / 100000).toFixed(2) + ' L';
    };

    const updateCalculator = () => {
        if (!calcAreaSlider || !calcTotalPrice) return;

        const area = parseInt(calcAreaSlider.value, 10);
        calcAreaVal.textContent = area.toLocaleString('en-IN');

        const totalCost = area * currentRate;

        // Animate price display
        calcTotalPrice.textContent = formatRupees(totalCost);
        calcTotalSub.textContent = `Approx. ${(totalCost / 100000).toFixed(2)} Lakhs for ${area.toLocaleString('en-IN')} sq.ft (${currentPkgName} • ${currentFloors})`;

        // Breakdown items
        const civilCost = Math.round(totalCost * 0.55);
        const finishCost = Math.round(totalCost * 0.22);
        const mepCost = Math.round(totalCost * 0.13);
        const designCost = Math.round(totalCost * 0.10);

        if (bdCivil) bdCivil.textContent = formatLakhs(civilCost);
        if (bdFinishes) bdFinishes.textContent = formatLakhs(finishCost);
        if (bdMep) bdMep.textContent = formatLakhs(mepCost);
        if (bdDesign) bdDesign.textContent = formatLakhs(designCost);

        // Update WhatsApp Quote Link
        if (calcWhatsAppBtn) {
            const quoteMsg = `🏠 *Construction Cost Estimate Request*\n\n` +
                `📐 *Built-up Area:* ${area} sq.ft\n` +
                `📦 *Package:* ${currentPkgName} (₹${currentRate}/sq.ft)\n` +
                `🏢 *Floors:* ${currentFloors}\n` +
                `💰 *Estimated Budget:* ${formatRupees(totalCost)} (~${(totalCost / 100000).toFixed(2)} Lakhs)\n\n` +
                `Hello Er. Barath, I calculated this estimate on your website and would like to discuss my project details!`;
            
            calcWhatsAppBtn.href = `https://wa.me/919787007583?text=${encodeURIComponent(quoteMsg)}`;
        }
    };

    if (calcAreaSlider) {
        calcAreaSlider.addEventListener('input', updateCalculator);

        pkgCards.forEach(card => {
            card.addEventListener('click', () => {
                pkgCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                currentRate = parseInt(card.getAttribute('data-rate'), 10);
                currentPkgName = card.getAttribute('data-pkg');
                updateCalculator();
            });
        });

        floorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                floorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFloors = btn.getAttribute('data-floor');
                updateCalculator();
            });
        });

        updateCalculator();
    }


    // ===== 5. STATS ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;

        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                const duration = 2000;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);

                    stat.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                };

                requestAnimationFrame(updateCount);
            });
        }
    };

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();


    // ===== 6. SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ===== 7. TESTIMONIALS SLIDER =====
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        let autoSlideInterval;

        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', `Testimonial slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            const next = (currentSlide + 1) % cards.length;
            goToSlide(next);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        startAutoSlide();

        const slider = document.getElementById('testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
        }
    }


    // ===== 8. FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        if (questionBtn && answerDiv) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                // Toggle current
                if (isActive) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                    answerDiv.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
                }
            });
        }
    });


    // ===== 9. CONTACT FORM TO WHATSAPP =====
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name') || '';
            const mobile = formData.get('mobile') || '';
            const location = formData.get('location') || '';
            const projectType = formData.get('project_type') || '';
            const plotSize = formData.get('plot_size') || '';
            const floors = formData.get('floors') || '';
            const budget = formData.get('budget') || '';
            const message = formData.get('message') || '';

            let waMsg = `🏠 *New Project Inquiry — Chozha Builders*\n\n`;
            waMsg += `👤 *Client Name:* ${name}\n`;
            waMsg += `📱 *Mobile:* ${mobile}\n`;
            if (location) waMsg += `📍 *Location:* ${location}\n`;
            if (projectType) waMsg += `🏗️ *Project Type:* ${projectType.replace(/_/g, ' ').toUpperCase()}\n`;
            if (plotSize) waMsg += `📐 *Plot Size:* ${plotSize}\n`;
            if (floors) waMsg += `🏢 *Floors:* ${floors.toUpperCase()}\n`;
            if (budget) waMsg += `💰 *Budget:* ${budget}\n`;
            if (message) waMsg += `\n💬 *Message:* ${message}\n`;

            const encodedMsg = encodeURIComponent(waMsg);
            const waUrl = `https://wa.me/919787007583?text=${encodedMsg}`;

            window.open(waUrl, '_blank');
        });
    }


    // ===== 10. SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const offset = 76;
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

});

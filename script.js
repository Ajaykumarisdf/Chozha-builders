/* ===== CHOZHA BUILDERS — INTERACTIVE LOGIC ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // ===== MOBILE NAVIGATION =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });


    // ===== ANIMATED STATS COUNTER =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;

        const statsSection = document.getElementById('stats');
        const rect = statsSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease-out cubic
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
    animateStats(); // Check on load too


    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll(
        '.service-card, .why-card, .stat-item, .contact-info-card, .project-card, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

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


    // ===== JOURNEY TIMELINE ANIMATION =====
    const journeySteps = document.querySelectorAll('.journey-step');

    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                journeyObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -60px 0px'
    });

    journeySteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.1}s`;
        journeyObserver.observe(step);
    });


    // ===== TESTIMONIALS SLIDER =====
    const track = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');
    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
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

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Pause on hover/touch
    const slider = document.getElementById('testimonials-slider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < cards.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
        startAutoSlide();
    }, { passive: true });


    // ===== CONTACT FORM → WHATSAPP =====
    const contactForm = document.getElementById('contact-form');

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

        // Build WhatsApp message
        let waMsg = `🏠 *New Project Inquiry — Chozha Builders*\n\n`;
        waMsg += `👤 *Name:* ${name}\n`;
        waMsg += `📱 *Mobile:* ${mobile}\n`;
        if (location) waMsg += `📍 *Location:* ${location}\n`;
        if (projectType) waMsg += `🏗️ *Project Type:* ${projectType.replace(/_/g, ' ')}\n`;
        if (plotSize) waMsg += `📐 *Plot Size:* ${plotSize}\n`;
        if (floors) waMsg += `🏢 *Floors:* ${floors.toUpperCase()}\n`;
        if (budget) waMsg += `💰 *Budget:* ${budget}\n`;
        if (message) waMsg += `\n💬 *Message:*\n${message}\n`;

        const encodedMsg = encodeURIComponent(waMsg);
        const waUrl = `https://wa.me/919787007583?text=${encodedMsg}`;

        window.open(waUrl, '_blank');
    });


    // ===== HERO VIDEO AUTOPLAY FALLBACK =====
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        heroVideo.play().catch(() => {
            // Autoplay blocked — add a play button or just let it sit
            heroVideo.setAttribute('controls', '');
        });
    }


    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 80; // navbar height
                const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ===== SERVICE CARDS — MOBILE TAP EFFECT =====
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card, .why-card, .project-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-8px)';
            }, { passive: true });
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            }, { passive: true });
        });
    }

});

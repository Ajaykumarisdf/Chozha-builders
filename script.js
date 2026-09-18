/* ============================================
   CHOZHA BUILDERS — INTERACTIVE JAVASCRIPT
   Robust, Modern, and Resilient
   ============================================ */

function initApp() {

    // ===== 1. SCROLL PROGRESS BAR & NAVBAR =====
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 40);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollTop > 400);
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
        const scrollPos = (window.scrollY || window.pageYOffset) + 140;
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


    // ===== 4. AUTOPLAY VIDEOS (Protected with Try/Catch) =====
    const heroVideo = document.getElementById('hero-video');
    const engineerVideo = document.getElementById('engineer-video');

    const ensurePlay = (videoEl) => {
        if (!videoEl) return;
        try {
            videoEl.muted = true;
            videoEl.playsInline = true;
            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    const onFirstInteraction = () => {
                        try { videoEl.play(); } catch (e) {}
                        document.removeEventListener('touchstart', onFirstInteraction);
                        document.removeEventListener('click', onFirstInteraction);
                    };
                    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
                    document.addEventListener('click', onFirstInteraction, { once: true, passive: true });
                });
            }
        } catch (e) {
            // Autoplay restricted by browser policy, handled silently
        }
    };

    ensurePlay(heroVideo);
    ensurePlay(engineerVideo);


    // ===== 5. INTERACTIVE ANIMATED COUNTERS (0 → Target) =====
    const counterElements = document.querySelectorAll('.counter-num');

    const runCounterAnimation = (counterEl, duration = 1800) => {
        const target = parseInt(counterEl.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const startTime = performance.now();
        counterEl.textContent = '0';

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            counterEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counterEl.textContent = target;
            }
        };

        requestAnimationFrame(updateCount);
    };

    if (counterElements.length > 0) {
        let hasAnimated = false;

        const triggerAllCounters = () => {
            if (hasAnimated) return;
            hasAnimated = true;
            counterElements.forEach(counter => runCounterAnimation(counter, 1800));
        };

        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const targetCounters = entry.target.querySelectorAll('.counter-num');
                        if (targetCounters.length > 0) {
                            targetCounters.forEach(c => runCounterAnimation(c, 1800));
                        } else if (entry.target.classList.contains('counter-num')) {
                            runCounterAnimation(entry.target, 1800);
                        }
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px 50px 0px'
            });

            // Observe the parent containers for reliable triggering
            const statContainers = document.querySelectorAll('.stats-section, .engineer-stats-strip, .stat-item, .eng-stat-box');
            statContainers.forEach(container => counterObserver.observe(container));

            // Safety fallback: trigger after 1.5s if not already visible
            setTimeout(() => {
                if (!hasAnimated) {
                    triggerAllCounters();
                }
            }, 1500);
        } else {
            // Fallback for browsers without IntersectionObserver
            setTimeout(triggerAllCounters, 300);
        }

        // Interactive Feature: Hover or Click replays the count-up animation!
        counterElements.forEach(counter => {
            const parentBox = counter.closest('.eng-stat-box') || counter.closest('.stat-item') || counter;
            parentBox.addEventListener('mouseenter', () => {
                runCounterAnimation(counter, 1200);
            });
            parentBox.addEventListener('click', () => {
                runCounterAnimation(counter, 1200);
            });
        });
    }


    // ===== 6. SCROLL REVEAL ANIMATIONS (Fail-safe) =====
    document.body.classList.add('js-ready');
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '0px 0px 80px 0px'
            });

            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('visible');
                } else {
                    revealObserver.observe(el);
                }
            });

            // Ensure no element stays hidden permanently
            setTimeout(() => {
                revealElements.forEach(el => el.classList.add('visible'));
            }, 2000);
        } else {
            revealElements.forEach(el => el.classList.add('visible'));
        }
    }


    // ===== 7. STAGGERED CARD ANIMATIONS =====
    const staggerSets = [
        '.services-grid .service-card',
        '.why-grid .why-card',
        '.stats-grid .stat-item',
        '.process-timeline .process-card',
        '.materials-grid .material-badge'
    ];

    staggerSets.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.06}s`;
        });
    });


    // ===== 8. TESTIMONIALS SLIDER =====
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

            // Touch/swipe support
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
                    if (diff > 0) {
                        goToSlide((currentSlide + 1) % cards.length);
                    } else {
                        goToSlide((currentSlide - 1 + cards.length) % cards.length);
                    }
                }
                startAutoSlide();
            }, { passive: true });
        }
    }


    // ===== 9. PARALLAX HERO =====
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            if (scrollTop < window.innerHeight) {
                const opacity = 1 - (scrollTop / (window.innerHeight * 0.7));
                const translateY = scrollTop * 0.25;
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        }, { passive: true });
    }


    // ===== 10. FREE QUOTE & ESTIMATION FORM TO WHATSAPP =====
    const contactForm = document.getElementById('contact-form');
    const quickChips = document.querySelectorAll('.quick-chip');
    const projectTypeSelect = document.getElementById('form-project-type');

    // Quick Inquiry Chips Selection
    if (quickChips.length && projectTypeSelect) {
        quickChips.forEach(chip => {
            chip.addEventListener('click', () => {
                quickChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const selectedVal = chip.getAttribute('data-type');
                if (selectedVal) {
                    projectTypeSelect.value = selectedVal;
                }
            });
        });

        projectTypeSelect.addEventListener('change', () => {
            quickChips.forEach(chip => {
                chip.classList.toggle('active', chip.getAttribute('data-type') === projectTypeSelect.value);
            });
        });
    }

    if (contactForm) {
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', () => {
                if (input.parentElement) {
                    input.parentElement.classList.add('focused');
                }
            });
            input.addEventListener('blur', () => {
                if (input.parentElement) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').trim();
            const mobile = (formData.get('mobile') || '').trim();
            const location = (formData.get('location') || '').trim();
            const projectType = (formData.get('project_type') || '').trim();
            const plotSize = (formData.get('plot_size') || '').trim();
            const floors = (formData.get('floors') || '').trim();
            const budget = (formData.get('budget') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!name || !mobile) {
                alert('Please enter your Name and Mobile Number.');
                return;
            }

            let waMsg = `🏠 *Free Quote & Estimation Request — Chozha Builders*\n\n`;
            waMsg += `👤 *Your Name:* ${name}\n`;
            waMsg += `📱 *Mobile Number:* ${mobile}\n`;
            if (location) waMsg += `📍 *Location:* ${location}\n`;
            if (projectType) waMsg += `🏗️ *Project Type:* ${projectType}\n`;
            if (plotSize) waMsg += `📐 *Plot Size:* ${plotSize}\n`;
            if (floors) waMsg += `🏢 *Floors:* ${floors}\n`;
            if (budget) waMsg += `💰 *Budget Range:* ${budget}\n`;
            if (message) waMsg += `\n💬 *Message:*\n${message}\n`;

            const encodedMsg = encodeURIComponent(waMsg);
            const waUrl = `https://wa.me/919787007583?text=${encodedMsg}`;

            window.open(waUrl, '_blank');
        });
    }


    // ===== 11. SMOOTH SCROLL FOR ANCHOR LINKS =====
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


    // ===== 12. TILT EFFECT ON SERVICE CARDS =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

}

// Robust execution whether DOM is already ready or loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

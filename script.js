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


    // ===== 5. LIVE INTERACTIVE PROGRESSIVE COUNTERS =====
    const statItems = document.querySelectorAll('.stats-grid .stat-item');
    const statsSection = document.getElementById('stats');

    const animateSingleCounter = (item, duration = 1400) => {
        if (!item) return;
        const counterEl = item.querySelector('.counter-num');
        const meterFill = item.querySelector('.stat-meter-fill');
        if (!counterEl) return;

        const target = parseInt(counterEl.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        item.classList.add('is-counting');
        counterEl.textContent = '0';
        if (meterFill) meterFill.style.width = '0%';

        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out cubic for realistic deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            counterEl.textContent = current;
            if (meterFill) {
                meterFill.style.width = `${Math.min(eased * 100, 100)}%`;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counterEl.textContent = target;
                if (meterFill) meterFill.style.width = '100%';
                setTimeout(() => item.classList.remove('is-counting'), 300);
            }
        };

        requestAnimationFrame(updateCount);
    };

    if (statItems.length > 0 && statsSection) {
        let hasAnimatedLive = false;

        const triggerLiveProgressiveCount = () => {
            if (hasAnimatedLive) return;
            hasAnimatedLive = true;

            // Orchestrated live progression: each stat card ticks up with a slight stagger
            statItems.forEach((item, index) => {
                setTimeout(() => {
                    animateSingleCounter(item, 1300 + index * 100);
                }, index * 140);
            });
        };

        // Method 1: Direct viewport check on scroll & resize
        const checkStatsInView = () => {
            if (hasAnimatedLive) return;
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 30 && rect.bottom > 30) {
                triggerLiveProgressiveCount();
            }
        };

        window.addEventListener('scroll', checkStatsInView, { passive: true });
        window.addEventListener('resize', checkStatsInView, { passive: true });

        // Method 2: Standard IntersectionObserver with low threshold
        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        triggerLiveProgressiveCount();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            statsObserver.observe(statsSection);
        }

        // Method 3: Immediate check in case section is already in view
        checkStatsInView();

        // Method 4: Safety fallback timer so it never fails to count live
        setTimeout(triggerLiveProgressiveCount, 1000);

        // Interactive Replay: Clicking or hovering on any card replays the live counter!
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.add('user-interacted');
                animateSingleCounter(item, 1000);
                setTimeout(() => item.classList.remove('user-interacted'), 600);
            });
            item.addEventListener('mouseenter', () => {
                if (hasAnimatedLive) {
                    animateSingleCounter(item, 900);
                }
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

        // Interactive visual feedback for radio pill options
        const projectRadioInputs = contactForm.querySelectorAll('input[name="project_type"]');
        projectRadioInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                const pill = radio.closest('.project-type-option')?.querySelector('.project-type-pill');
                if (pill) {
                    pill.style.transform = 'scale(0.96)';
                    setTimeout(() => { pill.style.transform = ''; }, 150);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').trim();
            const mobile = (formData.get('mobile') || '').trim();
            const location = (formData.get('location') || '').trim();
            const projectType = (formData.get('project_type') || contactForm.querySelector('input[name="project_type"]:checked')?.value || 'Independent House').trim();
            const plotSize = (formData.get('plot_size') || '').trim();
            const floors = (formData.get('floors') || '').trim();
            const budget = (formData.get('budget') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!name || !mobile) {
                alert('Please enter your Name and Mobile Number.');
                return;
            }

            // Professional, executive inquiry formatting — zero cartoon emojis
            let waMsg = `*CHOZHA BUILDERS — PROJECT QUOTE & ESTIMATION INQUIRY*\n`;
            waMsg += `Direct Consultation with Er. Barath, Lead Civil Engineer\n`;
            waMsg += `--------------------------------------------------\n\n`;
            waMsg += `• Client Name: ${name}\n`;
            waMsg += `• Mobile Number: ${mobile}\n`;
            if (location) waMsg += `• Site Location: ${location}\n`;
            if (projectType) waMsg += `• Project Type: ${projectType}\n`;
            if (plotSize) waMsg += `• Plot / Built-up Area: ${plotSize}\n`;
            if (floors) waMsg += `• Proposed Floors: ${floors}\n`;
            if (budget) waMsg += `• Planned Budget: ${budget}\n`;
            if (message) waMsg += `\n• Requirements & Details:\n${message}\n`;
            waMsg += `\n--------------------------------------------------\n`;
            waMsg += `Inquiry generated from official website: chozhabuilders.in`;

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

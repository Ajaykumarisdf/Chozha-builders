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


    // ===== 3. ACTIVE NAV LINK (MULTI-PAGE & SCROLL SUPPORT) =====
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Set active link based on current page
    navLinkItems.forEach(link => {
        const href = (link.getAttribute('href') || '').split('#')[0];
        const isCurrent = href === currentPath || 
                         (currentPath === 'index.html' && (href === '' || href === './' || href === 'index.html')) ||
                         (currentPath === '' && (href === 'index.html' || href === './'));
        if (isCurrent && href !== '') {
            link.classList.add('active');
        }
    });

    const highlightNav = () => {
        if (sections.length <= 1) return;
        const scrollPos = (window.scrollY || window.pageYOffset) + 140;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    if (link.getAttribute('href')?.startsWith('#')) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    }
                });
            }
        });
    };

    if (sections.length > 1) {
        window.addEventListener('scroll', highlightNav, { passive: true });
    }


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


    // ===== 10. FREE QUOTE & ESTIMATION FORM VIA FORMSPREE (EMAIL) =====
    const contactForm = document.getElementById('contact-form');
    const formSuccessOverlay = document.getElementById('form-success-overlay');
    const formSuccessClose = document.getElementById('form-success-close');

    if (formSuccessClose && formSuccessOverlay) {
        formSuccessClose.addEventListener('click', () => {
            formSuccessOverlay.classList.remove('show');
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

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Bot honeypot check
            const honeypot = contactForm.querySelector('input[name="_gotcha"]');
            if (honeypot && honeypot.value) {
                return;
            }

            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').trim();
            const mobile = (formData.get('mobile') || '').trim();
            const email = (formData.get('email') || '').trim();
            const location = (formData.get('location') || '').trim();
            const projectType = (formData.get('project_type') || contactForm.querySelector('input[name="project_type"]:checked')?.value || 'Independent House').trim();
            const plotSize = (formData.get('plot_size') || '').trim();
            const floors = (formData.get('floors') || '').trim();
            const budget = (formData.get('budget') || '').trim();
            const message = (formData.get('message') || '').trim();

            // Gentle check: ensure at least one contact channel (Name, Mobile, or Email)
            if (!name && !mobile && !email) {
                alert('Please enter at least your Name or Contact Number/Email so Er. Barath can reach you.');
                const firstField = contactForm.querySelector('#form-name') || contactForm.querySelector('#form-mobile');
                if (firstField) firstField.focus();
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]') || document.getElementById('form-submit');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Free Quote Request';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('form-submit-loading');
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite;">
                        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    <span>Sending Quote Request...</span>
                `;
            }

            // Track in Vercel Analytics
            if (typeof window.va === 'function') {
                try {
                    window.va('event', {
                        name: 'quote_form_submitted',
                        data: {
                            project_type: projectType,
                            has_location: String(Boolean(location)),
                            has_plot_size: String(Boolean(plotSize)),
                            has_budget: String(Boolean(budget))
                        }
                    });
                } catch (vaErr) {
                    console.warn('Analytics event failed:', vaErr);
                }
            }

            // Submit to Formspree endpoint via AJAX
            const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mvkzpeqp';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success! Show beautiful overlay
                    if (formSuccessOverlay) {
                        formSuccessOverlay.classList.add('show');
                    } else {
                        alert('Thank you! Your quote request has been sent to Er. Barath. We will contact you shortly.');
                    }
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        alert(data.errors.map(err => err.message).join(', '));
                    } else {
                        // Fallback: standard submit
                        contactForm.submit();
                    }
                }
            } catch (err) {
                console.warn('AJAX submit error, falling back to native POST:', err);
                // Fallback to native form post if fetch fails
                contactForm.submit();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('form-submit-loading');
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
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

    // ===== 13. VERCEL ANALYTICS CTA TRACKING =====
    document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function () {
            if (typeof window.va === 'function') {
                const isPhone = this.href.startsWith('tel:');
                window.va('event', {
                    name: isPhone ? 'phone_call_clicked' : 'whatsapp_clicked',
                    data: {
                        source: this.id || this.className || 'link'
                    }
                });
            }
        });
    });

}

// Robust execution whether DOM is already ready or loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

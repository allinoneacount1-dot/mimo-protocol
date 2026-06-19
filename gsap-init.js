(() => {
    'use strict';

    /* ============================================================
       GSAP Animations — mimo
       Requires: gsap.min.js + ScrollTrigger.min.js (CDN)
       ============================================================ */

    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 100);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        /* ---- Reduced motion check ---- */
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            // Kill all animations, show elements immediately
            gsap.globalTimeline.clear();
            ScrollTrigger.getAll().forEach(t => t.kill());
            document.querySelectorAll('[data-gsap]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        /* ---- Easing curves ---- */
        const E = {
            out: 'power3.out',
            inOut: 'power2.inOut',
            snap: 'power4.out',
            elastic: 'elastic.out(1, 0.5)',
        };

        /* ===========================================================
           INDEX PAGE — Landing
           =========================================================== */

        // Hero entrance
        const heroTl = gsap.timeline({ defaults: { ease: E.out } });

        heroTl
            .from('.hero__eyebrow', {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 0.2,
            })
            .from('.hero__title', {
                opacity: 0,
                y: 40,
                duration: 0.8,
            }, '-=0.3')
            .from('.hero__body', {
                opacity: 0,
                y: 30,
                duration: 0.6,
            }, '-=0.5')
            .from('.hero__actions', {
                opacity: 0,
                y: 20,
                duration: 0.5,
            }, '-=0.4')
            .from('.hero__metrics .metric', {
                opacity: 0,
                y: 25,
                stagger: 0.12,
                duration: 0.5,
            }, '-=0.3');

        // Orb float
        gsap.to('.orb__core', {
            y: -8,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });

        gsap.to('.orb__ring--1', {
            scale: 1.03,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });

        // Split section — left slides in, right fades
        gsap.from('.split__left', {
            scrollTrigger: {
                trigger: '.split',
                start: 'top 80%',
                end: 'top 40%',
                scrub: 0.8,
            },
            x: -60,
            opacity: 0,
        });

        gsap.from('.split__right', {
            scrollTrigger: {
                trigger: '.split',
                start: 'top 75%',
                end: 'top 35%',
                scrub: 0.8,
            },
            x: 60,
            opacity: 0,
        });

        // Bento cards — stagger reveal
        gsap.from('.bento__card', {
            scrollTrigger: {
                trigger: '.bento__grid',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: {
                each: 0.1,
                from: 'start',
            },
            ease: E.out,
        });

        // Bento stats — count up effect with GSAP
        document.querySelectorAll('.bento__stat').forEach(el => {
            const text = el.textContent.trim();
            const num = parseFloat(text);
            if (isNaN(num)) return;

            const suffix = text.replace(/[\d.,]/g, '');
            const hasDecimal = text.includes('.');

            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
                textContent: 0,
                duration: 1.5,
                ease: E.out,
                snap: hasDecimal ? { textContent: 0.1 } : { textContent: 1 },
                onUpdate: function () {
                    const val = parseFloat(el.textContent);
                    if (hasDecimal) {
                        el.textContent = val.toFixed(1) + suffix;
                    } else {
                        el.textContent = Math.floor(val) + suffix;
                    }
                },
            });
        });

        // Process steps — slide up with stagger
        gsap.from('.process__step', {
            scrollTrigger: {
                trigger: '.process__steps',
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: E.out,
        });

        // Presale card — scale up
        gsap.from('.presale__card', {
            scrollTrigger: {
                trigger: '.presale',
                start: 'top 75%',
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            ease: E.out,
        });

        // Progress bar fill animation
        gsap.from('.presale__bar-fill', {
            scrollTrigger: {
                trigger: '.presale__progress',
                start: 'top 85%',
                once: true,
            },
            width: '0%',
            duration: 1.5,
            ease: E.out,
        });

        // FAQ items — stagger fade
        gsap.from('.faq__item', {
            scrollTrigger: {
                trigger: '.faq__list',
                start: 'top 80%',
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: E.out,
        });

        // Parallax on hero grain
        gsap.to('.hero__grain', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
            y: 100,
            opacity: 0.01,
        });

        /* ===========================================================
           INNER PAGES — About, Docs, Token, Blog, Whitepaper
           =========================================================== */

        // Page hero entrance
        const pageHero = document.querySelector('.page-hero__title');
        if (pageHero) {
            gsap.from('.page-hero__title', {
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: 0.2,
                ease: E.out,
            });
            gsap.from('.page-hero__body', {
                opacity: 0,
                y: 25,
                duration: 0.6,
                delay: 0.4,
                ease: E.out,
            });
        }

        // Team cards
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length) {
            gsap.from('.team-card', {
                scrollTrigger: {
                    trigger: '.team-grid',
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: E.out,
            });
        }

        // Token stats
        const tokenStats = document.querySelectorAll('.token-stat');
        if (tokenStats.length) {
            gsap.from('.token-stat', {
                scrollTrigger: {
                    trigger: '.token-stats',
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: E.out,
            });
        }

        // Token rows
        const tokenRows = document.querySelectorAll('.token-row');
        if (tokenRows.length) {
            gsap.from('.token-row', {
                scrollTrigger: {
                    trigger: '.tokenomics-split',
                    start: 'top 80%',
                },
                x: -30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: E.out,
            });
        }

        // Blog cards
        const blogCards = document.querySelectorAll('.blog-card');
        if (blogCards.length) {
            gsap.from('.blog-card', {
                scrollTrigger: {
                    trigger: '.blog-list__inner',
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: E.out,
            });
        }

        // Content blocks
        const contentBlocks = document.querySelectorAll('.content-block h2, .content-block h3, .content-block p');
        if (contentBlocks.length) {
            gsap.from('.content-block h2, .content-block h3, .content-block p', {
                scrollTrigger: {
                    trigger: '.content-block',
                    start: 'top 80%',
                },
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: E.out,
            });
        }

        // Docs/Whitepaper sections
        const docSections = document.querySelectorAll('.docs-section, .wp-section');
        if (docSections.length) {
            docSections.forEach(section => {
                gsap.from(section.children, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                    },
                    y: 25,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: E.out,
                });
            });
        }

        // Code blocks — typewriter feel
        const codeBlocks = document.querySelectorAll('.code-block');
        if (codeBlocks.length) {
            gsap.from('.code-block', {
                scrollTrigger: {
                    trigger: '.steps',
                    start: 'top 80%',
                },
                opacity: 0,
                x: -20,
                duration: 0.6,
                stagger: 0.15,
                ease: E.out,
            });
        }

        // Arch cards
        const archCards = document.querySelectorAll('.arch-card');
        if (archCards.length) {
            gsap.from('.arch-card', {
                scrollTrigger: {
                    trigger: '.arch-grid',
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: E.out,
            });
        }

        // Steps
        const steps = document.querySelectorAll('.step');
        if (steps.length) {
            gsap.from('.step', {
                scrollTrigger: {
                    trigger: '.steps',
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: E.out,
            });
        }

        // Footer entrance
        gsap.from('.footer__inner > *', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: E.out,
        });

        /* ---- Smooth scroll parallax for nav ---- */
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: '+=200',
            onUpdate: (self) => {
                const nav = document.querySelector('.nav');
                if (nav) {
                    nav.style.backdropFilter = `blur(${14 + self.progress * 6}px)`;
                }
            },
        });

        /* ---- Refresh on load ---- */
        ScrollTrigger.refresh();
    }

    /* ---- Init when DOM ready ---- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAP);
    } else {
        initGSAP();
    }
})();

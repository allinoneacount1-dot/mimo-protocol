(() => {
    'use strict';

    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 80);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            gsap.globalTimeline.clear();
            ScrollTrigger.getAll().forEach(t => t.kill());
            return;
        }

        const E = {
            out: 'power3.out',
            snap: 'power4.out',
            elastic: 'elastic.out(1, 0.5)',
            smooth: 'power2.inOut',
        };

        /* ===========================================================
           HERO — Cinematic Entrance
           =========================================================== */
        const heroTl = gsap.timeline({ defaults: { ease: E.out } });

        heroTl
            .from('.hero__badge', {
                opacity: 0, y: 20, duration: 0.7, delay: 0.3,
            })
            .from('.hero__line--1', {
                opacity: 0, y: 60, skewY: 3, duration: 0.9,
            }, '-=0.3')
            .from('.hero__line--2', {
                opacity: 0, y: 60, skewY: 3, duration: 0.9,
            }, '-=0.6')
            .from('.hero__line--3', {
                opacity: 0, y: 60, skewY: 3, duration: 0.9,
            }, '-=0.6')
            .from('.hero__arrow', {
                opacity: 0, scale: 0.5, rotation: -45, duration: 0.7,
            }, '-=0.4')
            .from('.hero__sub', {
                opacity: 0, y: 30, duration: 0.6,
            }, '-=0.5')
            .from('.hero__ctas', {
                opacity: 0, y: 20, duration: 0.5,
            }, '-=0.3')
            .from('.hero__scroll', {
                opacity: 0, duration: 0.5,
            }, '-=0.2');

        // Orb float
        gsap.to('.hero__orb-core', {
            y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        // Parallax on hero elements
        gsap.to('.hero__visual', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: -100,
            opacity: 0.3,
        });

        gsap.to('.hero__content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: 60,
            opacity: 0,
        });

        /* ===========================================================
           MANIFESTO — Editorial Reveal
           =========================================================== */
        gsap.from('.manifesto__left', {
            scrollTrigger: {
                trigger: '.manifesto',
                start: 'top 75%',
            },
            x: -80,
            opacity: 0,
            duration: 1,
            ease: E.out,
        });

        gsap.from('.manifesto__right', {
            scrollTrigger: {
                trigger: '.manifesto',
                start: 'top 70%',
            },
            x: 80,
            opacity: 0,
            duration: 1,
            ease: E.out,
        });

        // Stats count-up
        document.querySelectorAll('.manifesto__stat-val').forEach(el => {
            const text = el.textContent.trim();
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            if (isNaN(num)) return;

            const prefix = text.match(/^\$/)?.[0] || '';
            const suffix = text.match(/[A-Z]+$/)?.[0] || '';

            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
                textContent: 0,
                duration: 2,
                ease: E.out,
                snap: { textContent: 1 },
                onUpdate: function () {
                    const val = Math.floor(parseFloat(el.textContent));
                    el.textContent = prefix + val.toLocaleString() + suffix;
                },
            });
        });

        /* ===========================================================
           STACK — Bento Stagger
           =========================================================== */
        gsap.from('.bento', {
            scrollTrigger: {
                trigger: '.stack__grid',
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: { each: 0.12, from: 'start' },
            ease: E.out,
        });

        // Bento stats count-up
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
                duration: 1.8,
                ease: E.out,
                snap: hasDecimal ? { textContent: 0.1 } : { textContent: 1 },
                onUpdate: function () {
                    const val = parseFloat(el.textContent);
                    el.textContent = (hasDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
                },
            });
        });

        /* ===========================================================
           NUMBERS — Counter Section
           =========================================================== */
        gsap.from('.numbers__item', {
            scrollTrigger: {
                trigger: '.numbers__grid',
                start: 'top 80%',
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: E.out,
        });

        document.querySelectorAll('.numbers__val[data-count]').forEach(el => {
            const target = Number(el.dataset.count);
            const prefix = el.dataset.prefix || '';

            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
                textContent: 0,
                duration: 2,
                ease: E.out,
                snap: { textContent: 1 },
                onUpdate: function () {
                    el.textContent = prefix + Math.floor(parseFloat(el.textContent)).toLocaleString();
                },
            });
        });

        /* ===========================================================
           PRESALE — Scale Reveal
           =========================================================== */
        gsap.from('.presale__card', {
            scrollTrigger: {
                trigger: '.presale',
                start: 'top 75%',
            },
            scale: 0.94,
            opacity: 0,
            duration: 1,
            ease: E.out,
        });

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

        /* ===========================================================
           FAQ — Stagger
           =========================================================== */
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

        /* ===========================================================
           INNER PAGES
           =========================================================== */
        const pageHero = document.querySelector('.page-hero__title');
        if (pageHero) {
            gsap.from('.page-hero__title', {
                opacity: 0, y: 50, skewY: 2, duration: 0.9, delay: 0.2, ease: E.out,
            });
            gsap.from('.page-hero__body', {
                opacity: 0, y: 30, duration: 0.6, delay: 0.4, ease: E.out,
            });
        }

        document.querySelectorAll('.team-card').length && gsap.from('.team-card', {
            scrollTrigger: { trigger: '.team-grid', start: 'top 80%' },
            y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: E.out,
        });

        document.querySelectorAll('.token-stat').length && gsap.from('.token-stat', {
            scrollTrigger: { trigger: '.token-stats', start: 'top 85%' },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: E.out,
        });

        document.querySelectorAll('.token-row').length && gsap.from('.token-row', {
            scrollTrigger: { trigger: '.tokenomics-split', start: 'top 80%' },
            x: -30, opacity: 0, duration: 0.5, stagger: 0.08, ease: E.out,
        });

        document.querySelectorAll('.blog-card').length && gsap.from('.blog-card', {
            scrollTrigger: { trigger: '.blog-list__inner', start: 'top 80%' },
            y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: E.out,
        });

        document.querySelectorAll('.docs-section, .wp-section').forEach(s => {
            gsap.from(s.children, {
                scrollTrigger: { trigger: s, start: 'top 85%' },
                y: 25, opacity: 0, duration: 0.5, stagger: 0.06, ease: E.out,
            });
        });

        document.querySelectorAll('.arch-card').length && gsap.from('.arch-card', {
            scrollTrigger: { trigger: '.arch-grid', start: 'top 80%' },
            y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: E.out,
        });

        document.querySelectorAll('.step').length && gsap.from('.step', {
            scrollTrigger: { trigger: '.steps', start: 'top 80%' },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: E.out,
        });

        gsap.from('.footer__inner > *', {
            scrollTrigger: { trigger: '.footer', start: 'top 90%' },
            y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: E.out,
        });

        ScrollTrigger.refresh();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAP);
    } else {
        initGSAP();
    }
})();

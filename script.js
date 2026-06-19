(() => {
    'use strict';

    /* ---- Counter Animation ---- */
    function animateCount(el, target, prefix, duration) {
        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = Number(el.dataset.count);
                const prefix = el.dataset.prefix || '';
                animateCount(el, target, prefix, 1800);
                io.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => io.observe(c));
    }

    /* ---- FAQ (using <details>) ---- */
    document.querySelectorAll('.faq__q').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item');
            const wasOpen = item.hasAttribute('open');
            // close all
            document.querySelectorAll('.faq__item[open]').forEach((i) => i.removeAttribute('open'));
            if (!wasOpen) item.setAttribute('open', '');
        });
    });

    /* ---- Presale Calculator ---- */
    const invest = document.getElementById('invest');
    const receive = document.getElementById('receive');
    if (invest && receive) {
        const PRICE = 0.008;
        invest.addEventListener('input', () => {
            const val = parseFloat(invest.value) || 0;
            const tokens = Math.floor(val / PRICE);
            receive.value = tokens.toLocaleString();
        });
    }

    /* ---- Nav Scroll ---- */
    const nav = document.querySelector('.nav');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            nav.style.borderBottomColor =
                window.scrollY > 60 ? 'var(--border)' : 'transparent';
            ticking = false;
        });
    });

    /* ---- Mobile Toggle ---- */
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!open));
            links.classList.toggle('is-open');
        });
        // close on link click
        links.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                links.classList.remove('is-open');
            });
        });
    }

    /* ---- Scroll Reveal (stagger, no transition:all) ---- */
    const reveals = document.querySelectorAll(
        '.bento__card, .process__step, .split__left, .split__right, .presale__card'
    );
    if (reveals.length) {
        const rIo = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const delay = Array.from(reveals).indexOf(el) % 4 * 80;
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, delay);
                    rIo.unobserve(el);
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)';
            rIo.observe(el);
        });
    }

    /* ---- Smooth Anchor ---- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

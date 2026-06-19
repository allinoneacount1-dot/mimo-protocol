(() => {
    'use strict';

    /* ---- FAQ (using <details>) ---- */
    document.querySelectorAll('.faq__q').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item');
            const wasOpen = item.hasAttribute('open');
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
            receive.value = Math.floor(val / PRICE).toLocaleString();
        });
    }

    /* ---- Mobile Menu ---- */
    const burger = document.querySelector('.nav__burger');
    const overlay = document.querySelector('.mobile-overlay');
    if (burger && overlay) {
        burger.addEventListener('click', () => {
            const open = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', String(!open));
            overlay.classList.toggle('is-open');
            document.body.style.overflow = open ? '' : 'hidden';
        });
        overlay.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('is-open');
                document.body.style.overflow = '';
            });
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
                // Close mobile menu if open
                if (overlay && overlay.classList.contains('is-open')) {
                    burger.setAttribute('aria-expanded', 'false');
                    overlay.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---- Nav pill blur intensity on scroll ---- */
    const navPill = document.querySelector('.nav__pill');
    if (navPill) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const blur = Math.min(24 + scrollY / 20, 40);
                const bg = scrollY > 100
                    ? 'rgba(255,255,255,.06)'
                    : 'rgba(255,255,255,.04)';
                navPill.style.backdropFilter = `blur(${blur}px)`;
                navPill.style.background = bg;
                ticking = false;
            });
        });
    }
})();

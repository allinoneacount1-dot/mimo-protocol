(() => {
    'use strict';

    /* ============================================================
       Theme Toggle — mimo
       Persists preference in localStorage
       Respects system preference
       ============================================================ */

    const STORAGE_KEY = 'mimo-theme';
    const html = document.documentElement;

    /* ---- Determine initial theme ---- */
    function getInitialTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') return saved;

        // Respect system preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }

    /* ---- Apply theme ---- */
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        // Update meta theme-color for mobile
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.content = theme === 'light' ? '#f5f2ed' : '#111010';
        }
    }

    /* ---- Toggle ---- */
    function toggleTheme() {
        const current = html.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    }

    /* ---- Init ---- */
    applyTheme(getInitialTheme());

    // Bind toggle buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle');
        if (btn) toggleTheme();
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

/* ============================================================
   Google Analytics 4 — mimo protocol
   Replace G-XXXXXXXXXX with your actual GA4 measurement ID
   ============================================================ */
(function() {
    'use strict';

    var GA_ID = 'G-XXXXXXXXXX';

    // Load gtag.js
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    // Initialize
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
    });
})();

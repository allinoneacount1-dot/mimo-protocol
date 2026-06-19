document.addEventListener('DOMContentLoaded', () => {
    // Counter animation for hero stats
    function animateCounter(element, target, prefix = '', duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (prefix === '$') {
                element.textContent = prefix + Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Initialize counters
    const counters = document.querySelectorAll('.stat-value[data-target]');
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const text = entry.target.textContent;
                const prefix = text.includes('$') ? '$' : '';
                animateCounter(entry.target, target, prefix);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Donut Chart
    const canvas = document.getElementById('donutChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const data = [30, 15, 25, 15, 10, 5];
        const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#4f46e5', '#3730a3'];
        const total = data.reduce((a, b) => a + b, 0);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const outerRadius = rect.width / 2 - 10;
        const innerRadius = outerRadius * 0.65;

        let animationProgress = 0;
        const animationDuration = 1500;
        let startTime = null;

        function drawChart(progress) {
            ctx.clearRect(0, 0, rect.width, rect.height);

            let startAngle = -Math.PI / 2;
            const totalAngle = (Math.PI * 2) * progress;

            data.forEach((value, index) => {
                const sliceAngle = (value / total) * Math.PI * 2;
                const endAngle = startAngle + Math.min(sliceAngle, totalAngle - (startAngle + Math.PI / 2));

                if (endAngle > startAngle) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
                    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = colors[index];
                    ctx.fill();
                }

                startAngle += sliceAngle;
            });
        }

        function animateChart(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            animationProgress = Math.min(elapsed / animationDuration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - animationProgress, 3);
            drawChart(eased);

            if (animationProgress < 1) {
                requestAnimationFrame(animateChart);
            }
        }

        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animateChart);
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        chartObserver.observe(canvas);
    }

    // Presale calculator
    const investInput = document.getElementById('investAmount');
    const receiveInput = document.getElementById('receiveAmount');
    const pricePerToken = 0.008;

    if (investInput && receiveInput) {
        investInput.addEventListener('input', () => {
            const amount = parseFloat(investInput.value) || 0;
            const tokens = Math.floor(amount / pricePerToken);
            receiveInput.value = tokens.toLocaleString();
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(9, 9, 11, 0.95)';
        } else {
            navbar.style.background = 'rgba(9, 9, 11, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.feature-card, .token-item, .roadmap-item, .team-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
});

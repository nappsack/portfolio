/* ============================================================
   SHOWCASE.JS — Interactions for premium device presentation
   ============================================================ */

(function () {
    'use strict';

    /* ---- Staggered Scroll Animations ---- */
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a stagger group, reveal children with delays
                if (entry.target.classList.contains('stagger-group')) {
                    const children = entry.target.querySelectorAll('.stagger-item');
                    children.forEach((child, i) => {
                        child.style.transitionDelay = (i * 0.12) + 's';
                        child.classList.add('visible');
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.stagger-group, .stagger-item, .stagger-left, .stagger-right, .stagger-scale').forEach(el => {
        staggerObserver.observe(el);
    });

    /* ---- Device Tilt on Hover (mouse-tracking) ---- */
    document.querySelectorAll('.device-tilt').forEach(device => {
        device.addEventListener('mouseenter', () => {
            device.setAttribute('data-tilt-active', '');
        });

        device.addEventListener('mousemove', (e) => {
            const rect = device.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (0.5 - y) * 10;   // max 5 degrees
            const tiltY = (x - 0.5) * 10;   // max 5 degrees

            device.style.setProperty('--tilt-x', tiltX + 'deg');
            device.style.setProperty('--tilt-y', tiltY + 'deg');
        });

        device.addEventListener('mouseleave', () => {
            device.removeAttribute('data-tilt-active');
            device.style.setProperty('--tilt-x', '0deg');
            device.style.setProperty('--tilt-y', '0deg');
        });
    });

    /* ---- Before / After Compare Slider ----
       Mouse follows on hover, no click needed; touch and pen drag. The
       divider stays wherever it was left. Matches the Point of Sale
       comparison in case-study.css / script.js. */
    document.querySelectorAll('.compare-slider').forEach(slider => {
        const beforeWrap = slider.querySelector('.compare-before');
        const handle = slider.querySelector('.compare-handle');
        let dragging = false;

        function setPosition(x) {
            const rect = slider.getBoundingClientRect();
            let pct = ((x - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            beforeWrap.style.width = pct + '%';
            handle.style.left = pct + '%';
        }

        // Start centred
        beforeWrap.style.width = '50%';
        handle.style.left = '50%';

        slider.addEventListener('pointerdown', (e) => {
            dragging = true;
            slider.setPointerCapture(e.pointerId);
            setPosition(e.clientX);
        });

        slider.addEventListener('pointermove', (e) => {
            if (dragging || e.pointerType === 'mouse') setPosition(e.clientX);
        });

        slider.addEventListener('pointerup', (e) => {
            dragging = false;
            if (slider.hasPointerCapture(e.pointerId)) slider.releasePointerCapture(e.pointerId);
        });
    });

    /* ---- Breakpoint Switcher — Tab navigation ---- */
    document.querySelectorAll('.bp-switcher').forEach(switcher => {
        const tabs = switcher.querySelectorAll('.bp-tab');
        const panels = switcher.querySelectorAll('.bp-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.bp;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                panels.forEach(p => {
                    p.classList.remove('active');
                    if (p.dataset.bpPanel === target) {
                        p.classList.add('active');
                    }
                });
            });
        });
    });

    /* ---- Image Lightbox ---- */
    // Create lightbox overlay once
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = '<img src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Any image with [data-lightbox] opens in lightbox
    document.querySelectorAll('[data-lightbox]').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    /* ---- DS Showcase Card Lightbox ---- */
    document.querySelectorAll('.ds-showcase-card img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    /* ---- Hover-to-play videos (extend existing behavior to new wrappers) ---- */
    document.querySelectorAll('.showcase-hero-device, .device-ipad, .device-desktop').forEach(wrap => {
        const video = wrap.querySelector('video');
        if (!video) return;

        // Auto-play if visible
        const playObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.3 });

        playObserver.observe(wrap);
    });

    /* ---- Parallax-lite on scroll for scene visuals ---- */
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        let rafId = null;

        function updateParallax() {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                const viewH = window.innerHeight;
                // How far through the viewport is this element (0 at bottom, 1 at top)
                const progress = (viewH - rect.top) / (viewH + rect.height);
                const offset = (progress - 0.5) * speed * 100;
                el.style.transform = 'translateY(' + offset + 'px)';
            });
            rafId = null;
        }

        window.addEventListener('scroll', () => {
            if (!rafId) rafId = requestAnimationFrame(updateParallax);
        }, { passive: true });

        updateParallax();
    }

    /* ---- Counter animation for stat numbers ---- */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            // Extract numeric value, prefix, suffix
            const match = raw.match(/^([^0-9]*)([\d,.]+)(.*)$/);
            if (!match) return;

            const prefix = match[1];
            const suffix = match[3];
            const target = parseFloat(match[2].replace(/,/g, ''));
            const hasDecimal = match[2].includes('.');
            const duration = 1200;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (hasDecimal) {
                    el.textContent = prefix + current.toFixed(1) + suffix;
                } else if (target >= 1000) {
                    el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
                } else {
                    el.textContent = prefix + Math.round(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    // Restore original text to preserve exact formatting
                    el.textContent = raw;
                }
            }

            el.textContent = prefix + '0' + suffix;
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cs-stat-number[data-counter]').forEach(el => {
        counterObserver.observe(el);
    });

})();

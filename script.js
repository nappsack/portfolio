// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate offset for fixed header
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: targetId === '#hero' ? 0 : offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttle scroll events for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            setActiveLink();
            ticking = false;
        });
        ticking = true;
    }
});

// Add header shadow on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Work cards click handling
const workCards = document.querySelectorAll('.work-card');
workCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // If it's a link (has href), let it navigate naturally
        if (card.tagName === 'A' && card.getAttribute('href')) return;
        e.preventDefault();
        console.log('Work card clicked - individual page coming soon!');
    });
});

// Scroll-triggered fade-in animations (only happen once)
const fadeInObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add visible class to trigger fade-in
            entry.target.classList.add('visible');
            // Stop observing this element so animation only happens once
            fadeInObserver.unobserve(entry.target);
        }
    });
}, fadeInObserverOptions);

// Observe all elements with fade-in-element class
document.querySelectorAll('.fade-in-element').forEach(element => {
    fadeInObserver.observe(element);
});

// Hero carousel rotation
const carouselWords = [
    'do anything',
    'build design systems',
    'mentor the next generation',
    'construct Figma architecture',
    'implement AI-assisted workflows',
    'provide team mentorship',
    'turn chaos into process',
    'usability test',
    'sing poorly at karaoke, but my heart will be in it',
    'establish design system governance',
    'strengthen cross-functional alignment',
    'create component libraries',
    'build culture with inappropriate humor',
    'interpret information architecture',
    'make it accessible',
    'make developer handoffs a breeze',
    'write pristine design documentation',
    'do a cartwheel (unconfirmed)',
    'implement design tokens',
    'build for enterprise clients',
    'do content strategy',
    'do interaction design',
    'scale teams and systems',
    'do like 40 push-ups probably',
    'do design ops',
    'bridge design and engineering',
    'do a competitive analysis',
    'construct atomic design systems',
    'develop Zeroheight storefronts',
    'apply product strategy',
    'dance badly but with confidence',
    'do CTA audits',
    'do native mobile design',
    'recite the prologue to the Canterbury Tales',
    'white-label systems',
    'advocate for the end user',
    'make designers better designers',
    'run sprint planning',
    'do your taxes (jk I can barely do my own)',
    'do this all day'
];
// Shuffle array (Fisher-Yates), keeping first item in place
for (let i = carouselWords.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [carouselWords[i], carouselWords[j]] = [carouselWords[j], carouselWords[i]];
}

const carousel = document.querySelector('.hero-carousel');
let currentWordIndex = 0;
let carouselInterval;

function advanceCarousel() {
    const currentWord = carousel.querySelector('.hero-carousel-word.active');
    currentWord.classList.remove('active');
    currentWord.classList.add('exit');

    currentWordIndex = (currentWordIndex + 1) % carouselWords.length;

    const newWord = document.createElement('span');
    newWord.className = 'hero-carousel-word';
    newWord.textContent = carouselWords[currentWordIndex];
    carousel.appendChild(newWord);

    requestAnimationFrame(() => {
        newWord.classList.add('active');
    });

    setTimeout(() => {
        if (currentWord.parentNode) {
            currentWord.remove();
        }
    }, 400);
}

if (carousel) {
    carouselInterval = setInterval(advanceCarousel, 2000);

    // Click to advance
    carousel.style.cursor = 'pointer';
    carousel.addEventListener('click', () => {
        clearInterval(carouselInterval);
        advanceCarousel();
        carouselInterval = setInterval(advanceCarousel, 2000);
    });
}

// Accordion toggle
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const body = button.nextElementSibling;

        // Close all other accordions
        document.querySelectorAll('.accordion-header').forEach(other => {
            if (other !== button) {
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.style.maxHeight = null;
                other.nextElementSibling.classList.remove('open');
            }
        });

        // Toggle current
        button.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            body.style.maxHeight = body.scrollHeight + 'px';
            body.classList.add('open');
        } else {
            body.style.maxHeight = null;
            body.classList.remove('open');
        }
    });
});

// Process modal
const processModalOverlay = document.getElementById('process-modal');
const openProcessModal = document.getElementById('open-process-modal');
const closeProcessModal = document.getElementById('close-process-modal');

if (openProcessModal && processModalOverlay) {
    openProcessModal.addEventListener('click', (e) => {
        e.preventDefault();
        processModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeProcessModal.addEventListener('click', () => {
        processModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    processModalOverlay.addEventListener('click', (e) => {
        if (e.target === processModalOverlay) {
            processModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && processModalOverlay.classList.contains('active')) {
            processModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Email modal
const emailModalOverlay = document.getElementById('email-modal');
const openEmailModal = document.getElementById('open-email-modal');
const closeEmailModal = document.getElementById('close-email-modal');
const copyEmailBtn = document.getElementById('copy-email-btn');

if (openEmailModal && emailModalOverlay) {
    openEmailModal.addEventListener('click', (e) => {
        e.preventDefault();
        emailModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeEmailModal.addEventListener('click', () => {
        emailModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    emailModalOverlay.addEventListener('click', (e) => {
        if (e.target === emailModalOverlay) {
            emailModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailModalOverlay.classList.contains('active')) {
            emailModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('chrisnappi88@gmail.com').then(() => {
            const label = copyEmailBtn.querySelector('.email-copy-label');
            const icon = copyEmailBtn.querySelector('[data-lucide]');
            copyEmailBtn.classList.add('copied');
            label.textContent = 'Copied!';
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons();

            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                label.textContent = 'Copy';
                icon.setAttribute('data-lucide', 'copy');
                lucide.createIcons();
            }, 2000);
        });
    });
}

// Image carousel
const carouselCaptions = [
    '<strong>Current architecture</strong> — The original two-tier model: a single Global UI Library feeding directly into five workstream files, each with WIP and Delivery branches.',
    '<strong>New architecture</strong> — The three-tier model I designed: Global UI Library at the top, domain-level pattern libraries (staff-facing and client-facing) in the middle, and workstream files at the bottom.',
    '<strong>Milestone tracking board</strong> — Progress across all three libraries mapped against the five readiness stages, with exit criteria and remaining work for each.',
    '<strong>Color tokens</strong> — Full color system with light and dark mode, organized by primary, neutral, system states, appointment statuses, and service categories.',
    '<strong>Figma variables</strong> — 85 color variables with light/dark mode bindings, plus spacing, typography, radius, and table tokens powering the entire system.',
    '<strong>Component documentation</strong> — Every component includes anatomy breakdowns, behavior specs, usage guidelines, and do/don\'t examples. This is the Cards component page.',
    '<strong>Staff-facing pattern library</strong> — Composed patterns for the Appointment Book showing component states, desktop and mobile breakpoints, and ready-for-dev annotations.',
    '<strong>Storybook integration</strong> — The engineering team\'s component browser with live previews, variant controls, and direct links back to Figma source files.'
];

document.querySelectorAll('.cs-carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.cs-carousel-slide');
    const dotsContainer = carousel.querySelector('.cs-carousel-dots');
    const captionEl = carousel.querySelector('.cs-carousel-caption');
    const prevBtn = carousel.querySelector('.cs-carousel-btn.cs-carousel-prev');
    const nextBtn = carousel.querySelector('.cs-carousel-btn.cs-carousel-next');
    let currentSlide = 0;

    // Get captions from data attribute or fall back to hardcoded array
    let captions = carouselCaptions;
    if (carousel.dataset.captions) {
        try { captions = JSON.parse(carousel.dataset.captions); } catch(e) {}
    }

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'cs-carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
        if (captionEl && captions[currentSlide]) {
            captionEl.innerHTML = captions[currentSlide];
        }
    }

    prevBtn.addEventListener('click', () => {
        resetZoom();
        goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        resetZoom();
        goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    });

    // Zoom and pan
    let zoomedImg = null;
    let isDragging = false;
    let startX, startY, originX, originY;

    function resetZoom() {
        if (zoomedImg) {
            zoomedImg.classList.remove('zoomed', 'dragging');
            zoomedImg.style.transformOrigin = 'center center';
            zoomedImg = null;
        }
    }

    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (!img) return;

        img.addEventListener('click', (e) => {
            if (isDragging) return;

            if (img.classList.contains('zoomed')) {
                resetZoom();
                return;
            }

            // Zoom into click point
            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = x + '% ' + y + '%';
            img.classList.add('zoomed');
            zoomedImg = img;
        });

        img.addEventListener('mousedown', (e) => {
            if (!img.classList.contains('zoomed')) return;
            e.preventDefault();
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;

            const origin = img.style.transformOrigin.split(' ');
            originX = parseFloat(origin[0]);
            originY = parseFloat(origin[1]);
            img.classList.add('dragging');

            function onMove(ev) {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;

                const rect = img.getBoundingClientRect();
                const scale = 2;
                const pctX = (dx / (rect.width / scale)) * -100;
                const pctY = (dy / (rect.height / scale)) * -100;

                let newX = Math.max(0, Math.min(100, originX + pctX));
                let newY = Math.max(0, Math.min(100, originY + pctY));
                img.style.transformOrigin = newX + '% ' + newY + '%';
            }

            function onUp() {
                img.classList.remove('dragging');
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                // Reset isDragging after a tick so the click handler sees it
                setTimeout(() => { isDragging = false; }, 10);
            }

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    });
});

// Hover-to-play videos
document.querySelectorAll('.work-device-wrap, .cs-hero-device').forEach(wrap => {
    const video = wrap.querySelector('video');
    if (!video) return;

    wrap.addEventListener('mouseenter', () => {
        video.play();
    });

    wrap.addEventListener('mouseleave', () => {
        video.pause();
    });
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Log page load
console.log('Portfolio site loaded successfully! 🎨');

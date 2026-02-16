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

// Work cards click handling (placeholder for future individual pages)
const workCards = document.querySelectorAll('.work-card');
workCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Work card clicked - individual page coming soon!');
        // Future: navigate to individual project pages
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

// Log page load
console.log('Portfolio site loaded successfully! 🎨');

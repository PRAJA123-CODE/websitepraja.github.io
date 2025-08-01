// ====== GLOBAL VARIABLES ======
let currentSlide = 0;
let isScrolling = false;

// ====== PRELOADER ======
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Fallback: hide preloader after 3 seconds
setTimeout(hidePreloader, 3000);

// ====== SMOOTH SCROLL POLYFILL ======
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader when page is loaded
    hidePreloader();
    
    // Initialize all components
    initializeAOS();
    initializeSwiper();
    initializeNavigation();
    initializeCounters();
    initializeGallery();
    initializeContactForm();
    initializeScrollEffects();
    initializeBackToTop();
    initializeAnimations();
    
    // Add event listeners
    addEventListeners();
});

// ====== AOS ANIMATION ======
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            delay: 0
        });
    }
}

// ====== SWIPER SLIDER ======
function initializeSwiper() {
    // Hero Slider
    if (document.querySelector('.hero-slider')) {
        new Swiper('.hero-slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }
    
    // Testimonials Slider
    if (document.querySelector('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            slidesPerView: 1,
            spaceBetween: 30,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
}

// ====== NAVIGATION ======
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (menuOverlay) {
                    menuOverlay.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    // Check if browser supports smooth scrolling
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        // Use polyfill for older browsers
                        smoothScrollTo(targetPosition);
                    }
                }
            }
        });
    });
    
    // Smooth scrolling for all anchor links (not just nav links)
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            const href = e.target.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                // Close mobile menu if open
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (menuOverlay) {
                        menuOverlay.classList.remove('active');
                    }
                    document.body.classList.remove('menu-open');
                }
                
                // Check if browser supports smooth scrolling
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Use polyfill for older browsers
                    smoothScrollTo(targetPosition);
                }
                
                // Update active navigation after scroll
                setTimeout(() => {
                    updateActiveNav();
                }, 100);
            }
        }
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    smoothScrollTo(targetPosition);
                }
            }
        });
    }
}

// ====== COUNTER ANIMATION ======
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }
    
    function checkCounters() {
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }
    
    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on initial load
}

// ====== GALLERY ======
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src;
            const imgAlt = img.alt;
            
            createLightbox(imgSrc, imgAlt);
        });
    });
}

function createLightbox(imgSrc, imgAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imgSrc}" alt="${imgAlt}">
            <div class="lightbox-caption">
                <h3>${imgAlt}</h3>
                <p>Nusa Penida, Bali, Indonesia</p>
            </div>
        </div>
    `;
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .lightbox.show {
            opacity: 1;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .lightbox-content img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            background: none;
            border: none;
        }
        .lightbox-caption {
            position: absolute;
            bottom: -60px;
            left: 0;
            right: 0;
            text-align: center;
            color: white;
        }
        .lightbox-caption h3 {
            margin-bottom: 0.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    
    // Show lightbox
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.head.removeChild(style);
        }, 300);
    };
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ====== CONTACT FORM ======
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const reservationForm = document.getElementById('reservationForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully. We will contact you soon!', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    if (reservationForm) {
        // Set minimum date to today
        const dateInput = reservationForm.querySelector('#reservation-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
        
        // Real-time validation
        const inputs = reservationForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate reservation form
            if (!validateReservationForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Terima kasih! Reservasi Anda telah berhasil dikirim. Kami akan segera mengkonfirmasi booking Anda!', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function validateForm(data) {
    const required = ['name', 'email', 'package', 'date', 'guests'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field} field.`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

function validateReservationForm(data) {
    const required = ['name', 'email', 'phone', 'package', 'date', 'guests'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Mohon isi field ${field}.`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Mohon masukkan alamat email yang valid.', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        showNotification('Mohon masukkan nomor telepon yang valid.', 'error');
        return false;
    }
    
    // Date validation - must be future date
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Tanggal tour harus di masa depan.', 'error');
        return false;
    }
    
    // Guests validation
    const guests = parseInt(data.guests);
    if (guests < 1 || guests > 50) {
        showNotification('Jumlah peserta harus antara 1-50 orang.', 'error');
        return false;
    }
    
    return true;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Field ini wajib diisi');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Format email tidak valid');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Format nomor telepon tidak valid');
            return false;
        }
    }
    
    // Date validation
    if (fieldName === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, 'Tanggal harus di masa depan');
            return false;
        }
    }
    
    // Guests validation
    if (fieldName === 'guests' && value) {
        const guests = parseInt(value);
        if (guests < 1 || guests > 50) {
            showFieldError(field, 'Jumlah peserta harus 1-50 orang');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.success {
            border-left: 4px solid #10b981;
        }
        .notification.error {
            border-left: 4px solid #ef4444;
        }
        .notification.info {
            border-left: 4px solid #3b82f6;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
        .notification.success .notification-content i {
            color: #10b981;
        }
        .notification.error .notification-content i {
            color: #ef4444;
        }
        .notification.info .notification-content i {
            color: #3b82f6;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #64748b;
            margin-left: auto;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                style.remove();
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                style.remove();
            }
        }, 300);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// ====== SCROLL EFFECTS ======
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeElements() {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible) {
                element.classList.add('fade-in-active');
            }
        });
    }
    
    window.addEventListener('scroll', checkFadeElements);
    checkFadeElements();
}

// ====== BACK TO TOP ======
function initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ====== ANIMATIONS ======
function initializeAnimations() {
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after page load
        setTimeout(typeWriter, 1000);
    }
    
    // Floating animation for elements
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Pulse animation for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        button.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
}

// ====== EVENT LISTENERS ======
function addEventListeners() {
    // Window resize handler
    window.addEventListener('resize', function() {
        // Refresh AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search (if exists)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
    
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ====== UTILITY FUNCTIONS ======
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ====== PERFORMANCE OPTIMIZATION ======
// Throttle scroll events
const throttledScrollHandler = throttle(function() {
    // Scroll-based animations and effects
    updateActiveNav();
    checkCounters();
    checkFadeElements();
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// ====== ERROR HANDLING ======
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// ====== ANALYTICS & TRACKING ======
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'contactForm') {
        trackEvent('form_submit', {
            form_name: 'contact_form',
            form_id: 'contactForm'
        });
    }
});

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: 'btn-primary'
        });
    }
});

// ====== ACCESSIBILITY ======
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab navigation for custom elements
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// ====== PWA SUPPORT ======
// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ====== EXPORT FUNCTIONS ======
// Make functions available globally if needed
window.MyTripNusaPenida = {
    showNotification,
    trackEvent,
    initializeCounters,
    initializeGallery
};

// ====== FINAL INITIALIZATION ======
// Ensure everything is loaded before final initialization
window.addEventListener('load', function() {
    // Final checks and cleanup
    console.log('My Trip Nusa Penida - Website loaded successfully!');
    
    // Remove any loading states
    document.body.classList.remove('loading');
    
    // Trigger any final animations
    setTimeout(() => {
        const finalElements = document.querySelectorAll('[data-aos]');
        finalElements.forEach(element => {
            if (element.classList.contains('aos-animate')) {
                element.style.opacity = '1';
            }
        });
    }, 1000);
}); 
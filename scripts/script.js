// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initializeCarousel();
    // Initialize slideshow
    initializeSlideshow();
    // Initialize smooth scrolling
    initializeSmoothScroll();
    // Initialize newsletter form
    initializeNewsletterForm();
});

// Carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    // Remove dynamic carousel item addition. Only add scroll buttons.
    const scrollLeft = document.createElement('button');
    const scrollRight = document.createElement('button');
    scrollLeft.className = 'carousel-scroll left';
    scrollRight.className = 'carousel-scroll right';
    scrollLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
    scrollRight.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const carouselWrapper = carousel.parentElement;
    carouselWrapper.appendChild(scrollLeft);
    carouselWrapper.appendChild(scrollRight);

    // Scroll functionality
    scrollLeft.addEventListener('click', () => {
        carousel.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    scrollRight.addEventListener('click', () => {
        carousel.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
}

// Slideshow functionality
function initializeSlideshow() {
    const slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    const slides = [
        {
            image: 'content resources/Applelogo.svg',
            title: 'iPhone 16 Pro',
            description: 'Expected release: September 2024'
        },
        {
            image: 'content resources/samsunglogo.svg',
            title: 'Samsung Galaxy S25',
            description: 'Expected release: February 2025'
        },
        {
            image: 'content resources/google pixel.png',
            title: 'Google Pixel 9',
            description: 'Expected release: October 2024'
        }
    ];

    // Create slideshow structure
    slideshow.innerHTML = `
        <div class="slideshow-container">
            <div class="slides"></div>
            <button class="slideshow-nav prev"><i class="fas fa-chevron-left"></i></button>
            <button class="slideshow-nav next"><i class="fas fa-chevron-right"></i></button>
            <div class="slideshow-dots"></div>
        </div>
    `;

    const slidesContainer = slideshow.querySelector('.slides');
    const dotsContainer = slideshow.querySelector('.slideshow-dots');
    let currentSlide = 0;

    // Populate slides
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
        slideElement.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}">
            <div class="slide-content">
                <h3>${slide.title}</h3>
                <p>${slide.description}</p>
            </div>
        `;
        slidesContainer.appendChild(slideElement);

        // Add dot
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Navigation functions
    function goToSlide(index) {
        const slides = slidesContainer.querySelectorAll('.slide');
        const dots = dotsContainer.querySelectorAll('.dot');
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // Add event listeners
    slideshow.querySelector('.next').addEventListener('click', nextSlide);
    slideshow.querySelector('.prev').addEventListener('click', prevSlide);

    // Auto-advance slides
    setInterval(nextSlide, 5000);
}

// Smooth scrolling functionality
function initializeSmoothScroll() {
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
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Thank you for subscribing!', 'success');
        form.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add carousel scroll button styles
const style = document.createElement('style');
style.textContent = `
    .carousel-scroll {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 130, 200, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
    }
    
    .carousel-scroll:hover {
        background: rgba(0, 130, 200, 1);
        transform: translateY(-50%) scale(1.1);
    }
    
    .carousel-scroll.left {
        left: 10px;
    }
    
    .carousel-scroll.right {
        right: 10px;
    }
    
    .slideshow-container {
        position: relative;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .slides {
        display: flex;
        transition: transform 0.5s ease;
    }
    
    .slide {
        min-width: 100%;
        position: relative;
        display: none;
    }
    
    .slide.active {
        display: block;
    }
    
    .slide img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    
    .slide-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        padding: 2rem;
    }
    
    .slideshow-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 130, 200, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .slideshow-nav:hover {
        background: rgba(0, 130, 200, 1);
    }
    
    .slideshow-nav.prev {
        left: 10px;
    }
    
    .slideshow-nav.next {
        right: 10px;
    }
    
    .slideshow-dots {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
    }
    
    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .dot.active {
        background: white;
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    }
    
    lastScroll = currentScroll;
});

// Add animation to feature cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

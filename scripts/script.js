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

    // Add more carousel items dynamically
    const carouselItems = [
        {
            image: 'placeholder1.jpg',
            title: 'iPhone 15 Pro',
            price: 'Starting from $999'
        },
        {
            image: 'placeholder2.jpg',
            title: 'Samsung Galaxy S24',
            price: 'Starting from $899'
        },
        {
            image: 'placeholder3.jpg',
            title: 'Google Pixel 8',
            price: 'Starting from $799'
        },
        {
            image: 'placeholder4.jpg',
            title: 'OnePlus 12',
            price: 'Starting from $899'
        }
    ];

    // Populate carousel items
    carouselItems.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.price}</p>
        `;
        carousel.appendChild(carouselItem);
    });

    // Add scroll buttons
    const scrollLeft = document.createElement('button');
    const scrollRight = document.createElement('button');
    scrollLeft.className = 'carousel-scroll left';
    scrollRight.className = 'carousel-scroll right';
    scrollLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
    scrollRight.innerHTML = '<i class="fas fa-chevron-right"></i>';

    carousel.parentElement.appendChild(scrollLeft);
    carousel.parentElement.appendChild(scrollRight);

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
            image: 'placeholder5.jpg',
            title: 'iPhone 16 Pro',
            description: 'Expected release: September 2024'
        },
        {
            image: 'placeholder6.jpg',
            title: 'Samsung Galaxy S25',
            description: 'Expected release: February 2025'
        },
        {
            image: 'placeholder7.jpg',
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

// Utility functions
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background-color: #4CAF50;
    }

    .notification.error {
        background-color: #f44336;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .carousel-scroll {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow);
    }

    .carousel-scroll.left {
        left: 10px;
    }

    .carousel-scroll.right {
        right: 10px;
    }

    .slideshow-container {
        position: relative;
        max-width: 1000px;
        margin: 0 auto;
    }

    .slide {
        display: none;
        position: relative;
    }

    .slide.active {
        display: block;
    }

    .slide img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 10px;
    }

    .slide-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: white;
        border-radius: 0 0 10px 10px;
    }

    .slideshow-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slideshow-nav.prev {
        left: 10px;
    }

    .slideshow-nav.next {
        right: 10px;
    }

    .slideshow-dots {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        padding: 0;
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

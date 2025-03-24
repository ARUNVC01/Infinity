// Main JavaScript for the Infinity website

// DOM Elements
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileMenu();
    initTestimonialSlider();
    handleMissingImages();
});

// Theme Toggle Functionality
function initThemeToggle() {
    // Enable dark mode on all pages
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check if user prefers dark mode in their OS settings
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply saved theme or use system preference
    if (savedTheme) {
        body.className = savedTheme;
    } else if (prefersDarkMode) {
        body.className = 'dark-mode';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.className = 'light-mode';
        localStorage.setItem('theme', 'light-mode');
    }
    
    // Listen for theme changes in system preferences
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                body.className = e.matches ? 'dark-mode' : 'light-mode';
            }
        });
    }
    
    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    let currentSlide = 0;
    
    // Set initial active slide
    testimonialSlides[currentSlide].classList.add('active');
    testimonialDots[currentSlide].classList.add('active');
    
    // Auto slide functionality
    const autoSlide = setInterval(nextSlide, 5000);
    
    // Next slide button
    nextBtn.addEventListener('click', function() {
        clearInterval(autoSlide);
        nextSlide();
    });
    
    // Previous slide button
    prevBtn.addEventListener('click', function() {
        clearInterval(autoSlide);
        prevSlide();
    });
    
    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(autoSlide);
            goToSlide(index);
        });
    });
    
    // Next slide function
    function nextSlide() {
        goToSlide((currentSlide + 1) % testimonialSlides.length);
    }
    
    // Previous slide function
    function prevSlide() {
        goToSlide((currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        // Remove active class from current slide and dot
        testimonialSlides[currentSlide].classList.remove('active');
        testimonialDots[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = slideIndex;
        
        // Add active class to new slide and dot
        testimonialSlides[currentSlide].classList.add('active');
        testimonialDots[currentSlide].classList.add('active');
    }
}

// Scroll animations
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Add scroll animations for sections
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - window.innerHeight * 0.7;
        
        if (scrollPosition > sectionTop) {
            section.classList.add('animate');
        }
    });
});

// Create an images folder with placeholder for images if they don't exist
function preloadImages() {
    // This function is added as a placeholder
    // In a real implementation, you would preload actual images
    console.log('Images would be preloaded here in a production environment');
}

// Preload images for better performance
window.addEventListener('load', preloadImages);

// Handle missing images gracefully
function handleMissingImages() {
    // Handle missing images by providing fallbacks
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            // Check which image failed and provide appropriate fallback
            if (img.src.includes('logo.png')) {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzYzNjZmMSIgcng9IjEwIiByeT0iMTAiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkluZmluaXR5PC90ZXh0Pjwvc3ZnPg==';
            } else if (img.src.includes('student')) {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIzMCIgZmlsbD0iI2YxZjFmMSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzAiIHI9IjE1IiBmaWxsPSIjY2NjIi8+PHBhdGggZD0iTTIwLDg1IEE0MCw0MCAwIDAsMCA4MCw4NSBaIiBmaWxsPSIjY2NjIi8+PC9zdmc+';
            }
            this.onerror = null; // Prevent infinite loop if the fallback also fails
        };
    });
} 
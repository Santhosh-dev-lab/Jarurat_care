// ===================================
// DYNAMIC INSPIRATIONAL QUOTES
// ===================================

// Fallback quotes in case API fails
const fallbackQuotes = [
    { text: "Hope is being able to see that there is light despite all of the darkness.", author: "Desmond Tutu" },
    { text: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'", author: "Mary Anne Radmacher" },
    { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
    { text: "The human spirit is stronger than anything that can happen to it.", author: "C.C. Scott" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "Every day may not be good, but there's something good in every day.", author: "Alice Morse Earle" },
    { text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", author: "Rikki Rogers" },
    { text: "You never know how strong you are until being strong is your only choice.", author: "Bob Marley" }
];

let currentQuoteIndex = 0;
let quoteRotationInterval;

// Fetch inspirational quote from API
async function fetchInspirationalQuote() {
    try {
        // Using ZenQuotes API (free, no API key required)
        const response = await fetch('https://zenquotes.io/api/random');
        const data = await response.json();

        if (data && data[0]) {
            const quote = {
                text: data[0].q,
                author: data[0].a
            };

            // Only return quotes that are short enough for single line (max 100 chars)
            if (quote.text.length <= 100) {
                return quote;
            } else {
                // If quote is too long, use fallback
                throw new Error('Quote too long');
            }
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.log('Using fallback quote');
        // Use fallback quotes if API fails or quote is too long
        const quote = fallbackQuotes[currentQuoteIndex];
        currentQuoteIndex = (currentQuoteIndex + 1) % fallbackQuotes.length;
        return quote;
    }
}

// Update quote in the DOM with smooth transition
async function updateQuote() {
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');

    if (!quoteText || !quoteAuthor) return;

    // Fade out
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    quoteText.style.transform = 'translateY(-10px)';
    quoteAuthor.style.transform = 'translateY(-10px)';

    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch and update quote
    const quote = await fetchInspirationalQuote();
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `— ${quote.author}`;

    // Fade in
    quoteText.style.opacity = '1';
    quoteAuthor.style.opacity = '1';
    quoteText.style.transform = 'translateY(0)';
    quoteAuthor.style.transform = 'translateY(0)';
}

// Initialize quotes functionality
function initializeQuotes() {
    // Load initial quote
    updateQuote();

    // Start auto-rotation
    startQuoteRotation();
}

// Auto-rotate quotes every 8 seconds
function startQuoteRotation() {
    quoteRotationInterval = setInterval(() => {
        updateQuote();
    }, 8000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQuotes);
} else {
    initializeQuotes();
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    });
});

// ===================================
// SMOOTH SCROLL & ACTIVE NAV LINKS
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }

    lastScroll = currentScroll;
});

// ===================================
// CONTACT FORM VALIDATION & SUBMISSION
// ===================================
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('formSuccess');

// Validation functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

// Show error message
function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = message;
    inputElement.style.borderColor = '#e91e63';
}

// Clear error message
function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = '';
    inputElement.style.borderColor = '#e0e0e0';
}

// Real-time validation
nameInput.addEventListener('blur', () => {
    if (!validateName(nameInput.value)) {
        showError('name', 'Please enter a valid name (at least 2 characters)');
    } else {
        clearError('name');
    }
});

emailInput.addEventListener('blur', () => {
    if (!validateEmail(emailInput.value)) {
        showError('email', 'Please enter a valid email address');
    } else {
        clearError('email');
    }
});

messageInput.addEventListener('blur', () => {
    if (!validateMessage(messageInput.value)) {
        showError('message', 'Please enter a message (at least 10 characters)');
    } else {
        clearError('message');
    }
});

// Clear errors on input
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input.id);
    });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearError('name');
    clearError('email');
    clearError('message');

    // Validate all fields
    let isValid = true;

    if (!validateName(nameInput.value)) {
        showError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }

    if (!validateEmail(emailInput.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!validateMessage(messageInput.value)) {
        showError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('.btn-submit');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Simulate form submission (since no backend is required)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide loading state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;

    // Show success message
    formSuccess.classList.add('show');

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        formSuccess.classList.remove('show');
    }, 5000);

    // Log form data (in real implementation, this would be sent to a backend)
    console.log('Form submitted:', {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        timestamp: new Date().toISOString()
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===================================
// PARTICLE ANIMATION
// ===================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random positioning
        const x = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 20;
        const size = 3 + Math.random() * 5;

        particle.style.left = `${x}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particlesContainer.appendChild(particle);
    }
}

// ===================================
// SCROLL ANIMATIONS UPDATE
// ===================================
// Observe elements for animation
document.querySelectorAll('.service-card, .stat-card, .contact-item, .testimonial-card, .hero-stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cancer Awareness & Support page loaded successfully');
    updateActiveNavLink();
    createParticles();
});

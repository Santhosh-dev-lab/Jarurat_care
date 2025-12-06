// ===================================
// DYNAMIC INSPIRATIONAL QUOTES
// ===================================

// Curated inspirational quotes relevant to cancer care
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

// Fetch quote from DummyJSON API with relevance filtering
async function fetchInspirationalQuote() {
    // Keywords relevant to cancer care and support
    const relevantKeywords = [
        'hope', 'strength', 'courage', 'heal', 'love', 'life',
        'faith', 'believe', 'strong', 'overcome', 'spirit',
        'heart', 'care', 'support', 'brave', 'light', 'journey',
        'persever', 'inspire', 'dream', 'tomorrow', 'future', 'kind'
    ];

    // Try up to 10 times to get a relevant quote from API
    for (let attempt = 0; attempt < 10; attempt++) {
        try {
            const randomId = Math.floor(Math.random() * 100) + 1;
            const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);

            if (!response.ok) continue;

            const data = await response.json();

            if (data && data.quote) {
                const quoteText = data.quote.toLowerCase();

                // Check if quote contains relevant keywords
                const isRelevant = relevantKeywords.some(keyword =>
                    quoteText.includes(keyword)
                );

                // Return if relevant and appropriate length
                if (isRelevant && data.quote.length <= 150) {
                    return {
                        text: data.quote,
                        author: data.author
                    };
                }
            }
        } catch (error) {
            // Continue to next attempt
        }
    }

    // Use fallback if no relevant quote found after 10 attempts
    const quote = fallbackQuotes[currentQuoteIndex];
    currentQuoteIndex = (currentQuoteIndex + 1) % fallbackQuotes.length;
    return quote;
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
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');

    if (!quoteText || !quoteAuthor) return;

    // Show initial quote immediately (no fade)
    const initialQuote = fallbackQuotes[0];
    quoteText.textContent = `"${initialQuote.text}"`;
    quoteAuthor.textContent = `— ${initialQuote.author}`;
    currentQuoteIndex = 1;

    // Start auto-rotation after a delay
    setTimeout(() => {
        startQuoteRotation();
    }, 8000);
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
// ANIMATED COUNTER FOR HERO STATS
// ===================================

// Easing function for smooth animation
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function animateCounter(element, target, duration = 2000, suffix = '') {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(update);
}

function initializeCounters() {
    const stats = document.querySelectorAll('.hero-stat-item strong');

    if (stats.length === 0) return;

    // Create an Intersection Observer to trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('strong');

                // Animate each stat
                statElements.forEach((stat, index) => {
                    const text = stat.textContent;
                    let target = 0;
                    let suffix = '';

                    // Extract number and suffix
                    if (text.includes('1000+')) {
                        target = 1000;
                        suffix = '+';
                        setTimeout(() => {
                            animateCounter(stat, target, 2000, suffix);
                        }, index * 200);
                    } else if (text.includes('24/7')) {
                        // Don't animate 24/7, just show it immediately
                        stat.textContent = '24/7';
                    } else if (text.includes('50+')) {
                        target = 50;
                        suffix = '+';
                        setTimeout(() => {
                            animateCounter(stat, target, 2000, suffix);
                        }, index * 200);
                    }
                });

                // Unobserve after animation starts
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe the stats container
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

// Initialize counters when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCounters);
} else {
    initializeCounters();
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
if (nameInput) {
    nameInput.addEventListener('blur', () => {
        if (!validateName(nameInput.value)) {
            showError('name', 'Please enter a valid name (at least 2 characters)');
        } else {
            clearError('name');
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (!validateEmail(emailInput.value)) {
            showError('email', 'Please enter a valid email address');
        } else {
            clearError('email');
        }
    });
}

if (messageInput) {
    messageInput.addEventListener('blur', () => {
        if (!validateMessage(messageInput.value)) {
            showError('message', 'Please enter a message (at least 10 characters)');
        } else {
            clearError('message');
        }
    });
}

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearError('name');
        clearError('email');
        clearError('message');

        // Validate all fields
        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError('name', 'Please enter a valid name');
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

        if (isValid) {
            // Show success message
            formSuccess.style.display = 'block';
            formSuccess.textContent = 'Thank you for your message! We will get back to you soon.';

            // Reset form
            contactForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });
}

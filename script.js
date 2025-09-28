// Typewriter Effect
class Typewriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.element.classList.add('typing');
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting) {
            // Typing forward
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                // Finished typing current text
                this.isPaused = true;
                this.element.classList.remove('typing');
                this.element.classList.add('finished');
                
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.element.classList.remove('finished');
                    this.element.classList.add('typing');
                    this.type();
                }, this.pauseTime);
                return;
            }
        } else {
            // Deleting backward
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                // Finished deleting
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                
                setTimeout(() => {
                    this.type();
                }, 200);
                return;
            }
        }
        
        const speed = this.isDeleting ? this.deleteSpeed : this.speed;
        setTimeout(() => this.type(), speed);
    }
}

// Initialize typewriter when page loads
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');
    const texts = [
        'Fullstack Developer',
        'Software Engineer',
        'Problem Solver',
        'Tech Enthusiast'
    ];
    
    if (typewriterElement) {
        // Add delay to sync with page animations
        setTimeout(() => {
            // Add initial animation class
            typewriterElement.style.opacity = '0';
            typewriterElement.style.transform = 'translateY(20px)';
            typewriterElement.style.transition = 'all 0.5s ease';
            
            // Fade in the typewriter
            setTimeout(() => {
                typewriterElement.style.opacity = '1';
                typewriterElement.style.transform = 'translateY(0)';
            }, 100);
            
            // Start typing after fade in
            setTimeout(() => {
                new Typewriter(typewriterElement, texts, {
                    speed: 120,
                    deleteSpeed: 60,
                    pauseTime: 2000
                });
            }, 600);
        }, 1200); // Start after 1.2 seconds
    }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Close mobile menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        links.forEach(link => {
            link.style.animation = '';
        });
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 100);
});

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Portfolio Filter will be handled by enhanced version below

// Animate skills on scroll
const skillProgress = document.querySelectorAll('.skill-progress');

function animateSkills() {
    skillProgress.forEach(progress => {
        const width = progress.parentElement.previousElementSibling.lastElementChild.textContent;
        progress.style.width = width;
    });
}

// Scroll Animation System
class ScrollAnimator {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }
    
    init() {
        // Create intersection observer with multiple thresholds for smoother animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: [0.1, 0.2],
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Start observing elements
        this.observeElements();
    }
    
    observeElements() {
        // Observe all scroll animate elements
        const elements = document.querySelectorAll(`
            .scroll-animate,
            .scroll-animate-left,
            .scroll-animate-right,
            .scroll-animate-scale,
            .scroll-stagger,
            .portfolio-item,
            .contact-card,
            .skill-badges
        `);
        
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    animateElement(element) {
        // Add animate class with slight delay for smoother effect
        setTimeout(() => {
            element.classList.add('animate');
            
            // Special handling for skill badges
            if (element.classList.contains('skill-badges')) {
                this.animateSkillBadges(element);
            }
            
            // Trigger skills animation for about section
            if (element.closest('#about')) {
                setTimeout(() => {
                    animateSkills();
                }, 300);
            }
        }, 100);
    }
    
    animateSkillBadges(skillBadges) {
        const badges = skillBadges.querySelectorAll('img');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }
    
    // Method to manually trigger animation for specific elements
    triggerAnimation(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!this.animatedElements.has(element)) {
                this.animateElement(element);
                this.animatedElements.add(element);
            }
        });
    }
}

// Initialize scroll animator when DOM is loaded
let scrollAnimator;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    scrollAnimator = new ScrollAnimator();
    
    // Trigger animations for elements already in view
    setTimeout(() => {
        scrollAnimator.triggerAnimation('.hero-content');
    }, 500);
});

// Enhanced portfolio filter with animation reset
// Get elements for portfolio filtering
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const allFilterBtns = document.querySelectorAll('.filter-btn');
        const allPortfolioItems = document.querySelectorAll('.portfolio-item');
        
        // Remove active class from all buttons
        allFilterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        allPortfolioItems.forEach((item, index) => {
            // Reset animation
            item.classList.remove('animate');
            
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                // Re-trigger animation with stagger delay
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Initialize skills animation when section is in view
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger skill badges animation
            setTimeout(() => {
                const skillBadges = document.querySelectorAll('.skill-badges');
                skillBadges.forEach(badges => {
                    scrollAnimator.animateElement(badges);
                });
            }, 500);
            
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

aboutObserver.observe(aboutSection);

// Particles.js Configuration
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#6c63ff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#6c63ff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// Enhanced Form Submission with Validation
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const formStatus = document.getElementById('form-status');

// Form validation functions
function validateName(name) {
    return name.length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.length >= 10;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    field.classList.add('error', 'shake');
    field.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Remove shake animation
    setTimeout(() => {
        field.classList.remove('shake');
    }, 500);
}

// Show success
function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    field.classList.add('success');
    field.classList.remove('error');
    errorElement.classList.remove('show');
}

// Clear all errors
function clearErrors() {
    const fields = ['name', 'email', 'subject', 'message'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        field.classList.remove('error', 'success');
        errorElement.classList.remove('show');
    });
}

// Show form status
function showFormStatus(type, message) {
    formStatus.className = `form-status show ${type}`;
    formStatus.innerHTML = type === 'success' 
        ? `<i class="fas fa-check-circle"></i> ${message}`
        : `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.classList.add('pulse');
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.classList.remove('pulse');
    }
}

// Initialize EmailJS
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    // You can get this from https://www.emailjs.com/
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS Public Key
    
    if (PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(PUBLIC_KEY);
    }
})();

// Send email using EmailJS
async function sendEmail(formData) {
    try {
        // Replace these with your actual EmailJS service ID and template ID
        const SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS Service ID
        const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS Template ID
        
        // If EmailJS is not configured, show demo message
        if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
            // Simulate API call delay for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { success: true, message: 'Demo mode: Message would be sent successfully!' };
        }
        
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Nguyen Manh Tung', // Your name
        };
        
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        
        if (response.status === 200) {
            return { success: true, message: 'Message sent successfully!' };
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw new Error('Failed to send message. Please try again later.');
    }
}

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearErrors();
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate fields
    if (!validateName(name)) {
        showError('name', 'Name must be at least 2 characters long.');
        isValid = false;
    } else {
        showSuccess('name');
    }
    
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
    } else {
        showSuccess('email');
    }
    
    if (subject === '') {
        showError('subject', 'Subject is required.');
        isValid = false;
    } else {
        showSuccess('subject');
    }
    
    if (!validateMessage(message)) {
        showError('message', 'Message must be at least 10 characters long.');
        isValid = false;
    } else {
        showSuccess('message');
    }
    
    if (!isValid) {
        showFormStatus('error', 'Please fix the errors above.');
        return;
    }
    
    // If validation passes, send the email
    try {
        setLoadingState(true);
        
        const formData = { name, email, subject, message };
        const result = await sendEmail(formData);
        
        showFormStatus('success', 'Thank you for your message! I will get back to you soon.');
        celebrateSuccess(); // Add confetti animation
        contactForm.reset();
        clearErrors();
        
        // Reset character counter
        charCount.textContent = '0/500';
        charCount.classList.remove('warning', 'limit');
        
        // Remove filled classes
        formInputs.forEach(input => {
            input.parentElement.classList.remove('filled');
        });
        
    } catch (error) {
        showFormStatus('error', error.message);
    } finally {
        setLoadingState(false);
    }
});

// Real-time validation on input
document.getElementById('name').addEventListener('blur', function() {
    const name = this.value.trim();
    if (name) {
        if (validateName(name)) {
            showSuccess('name');
        } else {
            showError('name', 'Name must be at least 2 characters long.');
        }
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email) {
        if (validateEmail(email)) {
            showSuccess('email');
        } else {
            showError('email', 'Please enter a valid email address.');
        }
    }
});

document.getElementById('message').addEventListener('blur', function() {
    const message = this.value.trim();
    if (message) {
        if (validateMessage(message)) {
            showSuccess('message');
        } else {
            showError('message', 'Message must be at least 10 characters long.');
        }
    }
});

// Character counter for message textarea
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('char-count');
const maxLength = 500;

messageTextarea.addEventListener('input', function() {
    const currentLength = this.value.length;
    charCount.textContent = `${currentLength}/${maxLength}`;
    
    // Update color based on character count
    charCount.classList.remove('warning', 'limit');
    if (currentLength > maxLength * 0.8) {
        charCount.classList.add('warning');
    }
    if (currentLength >= maxLength) {
        charCount.classList.add('limit');
        this.value = this.value.substring(0, maxLength);
        charCount.textContent = `${maxLength}/${maxLength}`;
    }
});

// Enhanced form interaction feedback
const formInputs = document.querySelectorAll('.form-control');

formInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
    
    // Floating label effect
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.parentElement.classList.add('filled');
        } else {
            this.parentElement.classList.remove('filled');
        }
    });
});

// Add success animation when form is submitted successfully
function celebrateSuccess() {
    // Create confetti effect
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉';
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.fontSize = '20px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.animation = 'confettiFall 3s linear forwards';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 3000);
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-20px) rotateZ(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Heart Trail Effect
let heartTimer = 0;

// Create heart trail
function createHeartTrail(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.innerHTML = '♥';
    heart.style.left = (x - 8) + 'px'; // Center the heart
    heart.style.top = (y - 8) + 'px';
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 1500);
}

// Mouse move handler for heart trail
document.addEventListener('mousemove', (e) => {
    heartTimer++;
    
    // Create heart trail every 8 mouse moves (adjust for frequency)
    if (heartTimer > 8) {
        createHeartTrail(e.clientX, e.clientY);
        heartTimer = 0;
    }
});

// Create multiple hearts on click
document.addEventListener('click', (e) => {
    // Create 3 hearts with slight delays and random positions
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            createHeartTrail(e.clientX + offsetX, e.clientY + offsetY);
        }, i * 100);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
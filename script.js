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
        'Software Engineer',
        'Full-Stack Developer'
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
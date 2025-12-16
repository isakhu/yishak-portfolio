/**
 * Modern Portfolio Website JavaScript
 * Enhanced with modern animations and interactions
 */

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for navigation links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

  // Initialize all components
  initMobileNavigation();
  initScrollAnimations();
  initSkillBars();
  initProjectFilters();
  initContactForm();
  initCopyButtons();
  initTypingAnimation();
  initParallaxEffects();
});

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
  const navToggle = $('.nav__toggle');
  const navMenu = $('.nav__menu');
  const navLinks = $$('.nav__link');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav__menu--active');
    navToggle.classList.toggle('nav__toggle--active');
    
    // Animate hamburger lines
    const lines = $$('.nav__toggle-line');
    lines.forEach((line, index) => {
      line.style.transform = navToggle.classList.contains('nav__toggle--active') 
        ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? '10px' : '0'}, ${index === 0 ? '6px' : index === 2 ? '-6px' : '0'})`
        : 'none';
      line.style.opacity = index === 1 && navToggle.classList.contains('nav__toggle--active') ? '0' : '1';
    });
  });

  // Close menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav__menu--active');
      navToggle.classList.remove('nav__toggle--active');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger skill bar animations when skills section is visible
        if (entry.target.classList.contains('skills')) {
          animateSkillBars();
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  $$('section').forEach(section => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });

  // Observe cards and other elements
  $$('.project-card, .achievement-card, .stat, .skill').forEach(element => {
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
  const skillBars = $$('.skill__progress');
  skillBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    if (width) {
      bar.style.width = '0%';
    }
  });
}

function animateSkillBars() {
  const skillBars = $$('.skill__progress');
  skillBars.forEach((bar, index) => {
    const width = bar.getAttribute('data-width');
    if (width) {
      setTimeout(() => {
        bar.style.width = width + '%';
      }, index * 200);
    }
  });
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
      button.classList.add('filter-btn--active');
      
      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = $('#contact-form');
  const successMessage = $('#form-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    $$('.form-error').forEach(error => error.textContent = '');
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    const errors = validateForm(data);
    
    if (Object.keys(errors).length > 0) {
      // Display errors
      Object.keys(errors).forEach(field => {
        const errorElement = $(`#${field}-error`);
        if (errorElement) {
          errorElement.textContent = errors[field];
        }
      });
      return;
    }
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Show success message
      successMessage.style.display = 'block';
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    }, 2000);
  });
}

function validateForm(data) {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.subject || data.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters long';
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== COPY TO CLIPBOARD =====
function initCopyButtons() {
  $$('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
        button.style.color = 'var(--color-success)';
        
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.color = '';
        }, 2000);
        
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const heroName = $('.hero__name');
  if (!heroName) return;

  const text = heroName.textContent;
  heroName.textContent = '';
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      heroName.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };
  
  // Start typing animation after a delay
  setTimeout(typeWriter, 1000);
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
  const hero = $('.hero');
  if (!hero) return;

  window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const parallax = hero.querySelector('.hero__content');
    
    if (parallax) {
      const speed = scrolled * 0.5;
      parallax.style.transform = `translateY(${speed}px)`;
    }
  }, 10));
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', throttle(() => {
  const header = $('.header');
  if (!header) return;

  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = 'var(--shadow-md)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
}, 10));

// ===== MODAL FUNCTIONALITY =====
function initModals() {
  const modal = $('#project-modal');
  const modalBody = $('#modal-body');
  const closeButtons = $$('[data-close-modal]');
  const modalTriggers = $$('[data-modal]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  function openModal(modalId) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Load modal content based on modalId
      loadModalContent(modalId);
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function loadModalContent(modalId) {
    // This would typically load content from an API or predefined data
    const content = getModalContent(modalId);
    if (modalBody) {
      modalBody.innerHTML = content;
    }
  }

  function getModalContent(modalId) {
    const contents = {
      'project-1': `
        <h2>TaskFlow - Project Management Platform</h2>
        <p>A comprehensive project management solution built with modern web technologies...</p>
        <h3>Key Features:</h3>
        <ul>
          <li>Real-time collaboration</li>
          <li>Task tracking and assignment</li>
          <li>Team analytics and reporting</li>
          <li>File sharing and version control</li>
        </ul>
      `,
      'project-2': `
        <h2>FitTrack - Fitness Companion App</h2>
        <p>A cross-platform mobile application for fitness enthusiasts...</p>
        <h3>Key Features:</h3>
        <ul>
          <li>Workout tracking and planning</li>
          <li>Nutrition monitoring</li>
          <li>AI-powered exercise recommendations</li>
          <li>Social features and challenges</li>
        </ul>
      `,
      // Add more project contents as needed
    };
    
    return contents[modalId] || '<p>Content not found.</p>';
  }
}

// ===== UTILITY FUNCTIONS =====
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

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images
function initLazyLoading() {
  const images = $$('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('loading');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    img.classList.add('loading');
    imageObserver.observe(img);
  });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===== EASTER EGGS =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Easter egg activated!
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 10000);
  }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(style);
// ===== PREMIUM ENHANCEMENTS FOR CLIENT APPEAL =====

// Add premium loading animation
document.addEventListener('DOMContentLoaded', () => {
  // Add premium cursor effect
  const cursor = document.createElement('div');
  cursor.className = 'premium-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.display = 'block';
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });

  // Add premium hover effects to interactive elements
  const interactiveElements = document.querySelectorAll('.btn, .project-card, .achievement-card, .stat');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.background = 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)';
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)';
    });
  });

  // Add success metrics counter animation
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat__number');
    counters.forEach(counter => {
      const target = counter.textContent;
      const isPercentage = target.includes('%');
      const isTime = target.includes('hrs');
      const isRatio = target.includes('/');
      
      if (!isPercentage && !isTime && !isRatio) {
        const numericValue = parseInt(target.replace(/\D/g, ''));
        if (numericValue) {
          let current = 0;
          const increment = numericValue / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + (target.includes('+') ? '+' : '');
            }
          }, 40);
        }
      }
    });
  };

  // Trigger counter animation when stats section is visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  });

  const statsSection = document.querySelector('.about__stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Add premium form validation with real-time feedback
  const form = document.getElementById('contact-form');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateFieldRealTime(input);
      });
    });
  }

  function validateFieldRealTime(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';

    switch (fieldName) {
      case 'name':
        isValid = value.length >= 2;
        message = isValid ? '✓ Looks good!' : 'Name must be at least 2 characters';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = isValid ? '✓ Valid email!' : 'Please enter a valid email';
        break;
      case 'subject':
        isValid = value.length >= 5;
        message = isValid ? '✓ Great subject!' : 'Subject must be at least 5 characters';
        break;
      case 'message':
        isValid = value.length >= 10;
        message = isValid ? '✓ Perfect!' : 'Message must be at least 10 characters';
        break;
    }

    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.color = isValid ? 'var(--color-success)' : 'var(--color-error)';
    }

    field.style.borderColor = isValid ? 'var(--color-success)' : 'var(--color-error)';
  }

  // Add premium scroll progress indicator
  const scrollProgress = document.createElement('div');
  scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #6366f1);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(scrollProgress);

  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
  });

  // Add premium testimonial rotation
  const testimonials = document.querySelectorAll('.testimonials > div > div > div');
  if (testimonials.length > 0) {
    let currentTestimonial = 0;
    setInterval(() => {
      testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = index === currentTestimonial ? '1' : '0.7';
        testimonial.style.transform = index === currentTestimonial ? 'scale(1.02)' : 'scale(1)';
      });
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }, 5000);
  }
});

// Add premium success notification
function showSuccessNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #34d399);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    font-weight: 600;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Enhanced contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="premium-loader" style="width: 20px; height: 20px; border-width: 2px;"></div>
          Sending...
        </div>
      `;
      submitButton.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success notification
        showSuccessNotification('🎉 Message sent! I\'ll respond within 24 hours.');
        
        // Reset form
        form.reset();
        
        // Clear validation messages
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(error => {
          error.textContent = '';
        });
        
        // Reset input border colors
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.style.borderColor = '';
        });
      }, 2000);
    });
  }
});
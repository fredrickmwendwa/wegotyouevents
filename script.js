// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 0);
});

// Animation on scroll with Intersection Observer
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image, .process-card, .team-card, .value-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
};

// Initialize animations on load
window.addEventListener('load', animateOnScroll);

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items
        const filter = btn.dataset.filter;
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Contact Form Handling with FormSubmit
document.getElementById('eventInquiryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(this);
    
    // Using FormSubmit.co for form handling
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Hide form and show success message
            document.getElementById('eventInquiryForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // Reset form after 5 seconds (for demo purposes)
            setTimeout(() => {
                document.getElementById('eventInquiryForm').reset();
                document.getElementById('eventInquiryForm').style.display = 'block';
                document.getElementById('formSuccess').style.display = 'none';
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 5000);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.innerHTML = 'Error - Try Again';
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }, 2000);
    });
});

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Video Background Playback Control
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    // Ensure video plays when tab becomes active
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            heroVideo.play().catch(e => console.log('Video play failed:', e));
        } else {
            heroVideo.pause();
        }
    });
    
    // Mute/unmute toggle
    heroVideo.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
    });
}

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        lazyImages.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    lazyLoadObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.dataset.src = img.src;
            img.src = '';
            lazyLoadObserver.observe(img);
        });
    }
});
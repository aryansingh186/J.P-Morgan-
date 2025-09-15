// J.P. Morgan Website Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== NAVIGATION FUNCTIONALITY ====================
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
        });
    }
    
    if (navClose && mobileMenu) {
        navClose.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    }
    
    // Desktop Navigation Overlays
    const overlays = {
        'solutions': {
            trigger: '[data-target="solutions"]',
            overlay: '#solutions-overlay',
            close: '#closeSolutions',
            menu: '#solutions-menu',
            content: '.solutions-content'
        },
        'who': {
            trigger: '[data-target="who"]',
            overlay: '#who-overlay',
            close: '#closeWho',
            menu: '#who-menu',
            content: '.who-content'
        },
        'insight': {
            trigger: '[data-target="insight"]',
            overlay: '#insight-overlay',
            close: '#closeInsight',
            menu: '#insight-menu',
            content: '.insight-content'
        },
        'about': {
            trigger: '[data-target="about"]',
            overlay: '#about-overlay',
            close: '#closeAbout',
            menu: '#about-menu',
            content: '.about-content'
        }
    };
    
    // Initialize overlay functionality
    Object.keys(overlays).forEach(key => {
        const config = overlays[key];
        const trigger = document.querySelector(config.trigger);
        const overlay = document.querySelector(config.overlay);
        const closeBtn = document.querySelector(config.close);
        const menu = document.querySelector(config.menu);
        
        if (trigger && overlay) {
            // Open overlay
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                closeAllOverlays();
                overlay.style.maxHeight = '500px';
                
                // Show first content by default
                const firstMenuItem = menu?.querySelector('li[data-content]');
                if (firstMenuItem) {
                    const contentId = firstMenuItem.getAttribute('data-content');
                    showOverlayContent(key, contentId);
                    setActiveMenuItem(menu, firstMenuItem);
                }
                
                // Rotate arrow
                const arrow = trigger.querySelector('.arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(180deg)';
                }
            });
            
            // Close overlay
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    closeOverlay(key, overlay, trigger);
                });
            }
            
            // Menu item interactions
            if (menu) {
                const menuItems = menu.querySelectorAll('li[data-content]');
                menuItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const contentId = this.getAttribute('data-content');
                        showOverlayContent(key, contentId);
                        setActiveMenuItem(menu, this);
                    });
                });
            }
        }
    });
    
    function closeAllOverlays() {
        Object.keys(overlays).forEach(key => {
            const overlay = document.querySelector(overlays[key].overlay);
            const trigger = document.querySelector(overlays[key].trigger);
            if (overlay) {
                closeOverlay(key, overlay, trigger);
            }
        });
    }
    
    function closeOverlay(key, overlay, trigger) {
        overlay.style.maxHeight = '0';
        
        // Reset arrow rotation
        const arrow = trigger?.querySelector('.arrow');
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
    }
    
    function showOverlayContent(overlayKey, contentId) {
        const config = overlays[overlayKey];
        const allContent = document.querySelectorAll(config.content);
        const targetContent = document.getElementById(contentId);
        
        // Hide all content
        allContent.forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show target content
        if (targetContent) {
            targetContent.classList.remove('hidden');
        }
    }
    
    function setActiveMenuItem(menu, activeItem) {
        const allItems = menu.querySelectorAll('li');
        allItems.forEach(item => {
            item.classList.remove('font-bold');
            item.classList.add('cursor-pointer', 'hover:text-black');
        });
        
        activeItem.classList.add('font-bold');
    }
    
    // Close overlays when clicking outside
    document.addEventListener('click', function(e) {
        const isNavClick = e.target.closest('[data-target]') || 
                          e.target.closest('[id$="-overlay"]') ||
                          e.target.closest('[id^="close"]');
        
        if (!isNavClick) {
            closeAllOverlays();
        }
    });
    
    // ==================== HERO SLIDER FUNCTIONALITY ====================
    
    const slider = document.getElementById('slider');
    const tabItems = document.querySelectorAll('.tab-item');
    let currentSlide = 0;
    const totalSlides = 3;
    let autoSlideInterval;
    
    // Initialize first slide as active
    if (tabItems.length > 0) {
        setActiveTab(0);
    }
    
    // Tab click handlers
    tabItems.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            goToSlide(index);
            resetAutoSlide();
        });
    });
    
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentSlide = index;
        const translateX = -(currentSlide * (100 / totalSlides));
        
        if (slider) {
            slider.style.transform = `translateX(${translateX}%)`;
        }
        
        setActiveTab(index);
    }
    
    function setActiveTab(index) {
        tabItems.forEach((tab, i) => {
            const underline = tab.querySelector('.underline-bar');
            if (i === index) {
                tab.classList.add('font-bold');
                if (underline) {
                    underline.style.opacity = '1';
                }
            } else {
                tab.classList.remove('font-bold');
                if (underline) {
                    underline.style.opacity = '0';
                }
            }
        });
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause auto-slide on hover
    const pageWrapper = document.getElementById('pageWrapper');
    if (pageWrapper) {
        pageWrapper.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });
        
        pageWrapper.addEventListener('mouseleave', function() {
            startAutoSlide();
        });
    }
    
    // ==================== CARD CAROUSEL FUNCTIONALITY ====================
    
    const cardSlider = document.getElementById('cardSlider');
    const dots = document.querySelectorAll('.dot');
    const prevBtns = [document.getElementById('prevCard'), document.getElementById('prevCardDesktop')];
    const nextBtns = [document.getElementById('nextCard'), document.getElementById('nextCardDesktop')];
    
    let cardCurrentSlide = 0;
    const cardsPerView = {
        mobile: 1,
        tablet: 2,
        desktop: 3
    };
    
    // Initialize card carousel
    if (cardSlider && dots.length > 0) {
        updateCardCarousel();
        setActiveDot(0);
    }
    
    // Previous button handlers
    prevBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                cardCurrentSlide = Math.max(0, cardCurrentSlide - 1);
                updateCardCarousel();
                setActiveDot(cardCurrentSlide);
            });
        }
    });
    
    // Next button handlers
    nextBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                const maxSlides = Math.max(0, dots.length - 1);
                cardCurrentSlide = Math.min(maxSlides, cardCurrentSlide + 1);
                updateCardCarousel();
                setActiveDot(cardCurrentSlide);
            });
        }
    });
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            cardCurrentSlide = index;
            updateCardCarousel();
            setActiveDot(index);
        });
    });
    
    function updateCardCarousel() {
        if (!cardSlider) return;
        
        const cardWidth = 346; // 330px + 16px gap
        const currentCardsPerView = getCurrentCardsPerView();
        const translateX = -(cardCurrentSlide * cardWidth * currentCardsPerView);
        
        cardSlider.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        updateCardNavButtons();
    }
    
    function getCurrentCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return cardsPerView.mobile;
        if (width < 1024) return cardsPerView.tablet;
        return cardsPerView.desktop;
    }
    
    function setActiveDot(index) {
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-black', 'border-black');
                dot.classList.remove('border-gray-500');
            } else {
                dot.classList.remove('bg-black', 'border-black');
                dot.classList.add('border-gray-500');
            }
        });
    }
    
    function updateCardNavButtons() {
        const isFirst = cardCurrentSlide === 0;
        const isLast = cardCurrentSlide >= dots.length - 1;
        
        // Update button opacity/state
        [...prevBtns, ...nextBtns].forEach(btn => {
            if (btn) {
                if ((prevBtns.includes(btn) && isFirst) || 
                    (nextBtns.includes(btn) && isLast)) {
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                } else {
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            }
        });
    }
    
    // Handle window resize for card carousel
    window.addEventListener('resize', function() {
        updateCardCarousel();
    });
    
    // ==================== SMOOTH SCROLLING ====================
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    
    // ==================== SCROLL ANIMATIONS ====================
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('main, section, .card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ==================== UTILITY FUNCTIONS ====================
    
    // Debounce function for performance
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
    
    // Throttle function for scroll events
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
    
    // ==================== HEADER SCROLL BEHAVIOR ====================
    
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // ==================== FORM HANDLING (if needed) ====================
    
    // Handle any forms on the page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted:', new FormData(form));
        });
    });
   
    document.addEventListener('keydown', function(e) {
        // Close overlays on Escape
        if (e.key === 'Escape') {
            closeAllOverlays();
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
        
        // Navigate carousel with arrow keys
        if (e.key === 'ArrowLeft' && cardCurrentSlide > 0) {
            cardCurrentSlide--;
            updateCardCarousel();
            setActiveDot(cardCurrentSlide);
        }
        
        if (e.key === 'ArrowRight' && cardCurrentSlide < dots.length - 1) {
            cardCurrentSlide++;
            updateCardCarousel();
            setActiveDot(cardCurrentSlide);
        }
    });
 
    const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
    

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    
    
   
    window.addEventListener('error', function(e) {
        console.warn('JavaScript error caught:', e.error);
       
    });
    
    console.log('J.P. Morgan website JavaScript initialized successfully');
});
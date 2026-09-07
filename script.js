// ===== HELMORA - Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });

    // Observe stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });

    // ===== COUNTER ANIMATION =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString('ar-SA');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('ar-SA');
            }
        }
        
        updateCounter();
    }

    // Trigger counters when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    if (target && !counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter, target);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ===== MOBILE MENU =====
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }

    // ===== GALLERY LIGHTBOX (Simple) =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const emoji = this.querySelector('.placeholder').textContent;
            const title = this.querySelector('.overlay span')?.textContent || '';
            
            // Create simple lightbox
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            lightbox.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 8rem; margin-bottom: 20px;">${emoji}</div>
                    <h3 style="color: #D4A853; font-size: 1.5rem; margin-bottom: 10px;">${title}</h3>
                    <p style="color: #888; font-size: 0.9rem;">اضغط في أي مكان للإغلاق</p>
                </div>
            `;
            
            lightbox.addEventListener('click', function() {
                this.remove();
            });
            
            document.body.appendChild(lightbox);
        });
    });

    // ===== DOWNLOAD BUTTON POPUP =====
    const downloadBtn = document.querySelector('.btn-primary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #111;
                border: 1px solid rgba(212,168,83,0.3);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                z-index: 10000;
                max-width: 350px;
                width: 90%;
                animation: fadeInUp 0.4s ease;
            `;
            
            popup.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 15px;">📱</div>
                <h3 style="color: #D4A853; font-size: 1.3rem; margin-bottom: 10px;">قريباً!</h3>
                <p style="color: #888; margin-bottom: 20px; line-height: 1.7;">
                    التطبيق قيد التطوير حالياً.<br>
                    سيتوفر قريباً على Google Play و App Store.
                </p>
                <button onclick="this.closest('div').remove(); document.querySelector('.popup-overlay')?.remove()" 
                        style="background: linear-gradient(135deg, #D4A853, #B8922E); color: #0A0A0A; border: none; 
                               padding: 12px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; font-family: 'Tajawal', sans-serif;">
                    حسناً
                </button>
            `;
            
            const overlay = document.createElement('div');
            overlay.className = 'popup-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
            
            overlay.addEventListener('click', function() {
                popup.remove();
                this.remove();
            });
        });
    }

    // ===== TYPING EFFECT FOR HERO =====
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ===== CURRENT YEAR =====
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

});

// ===== GLOBAL ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

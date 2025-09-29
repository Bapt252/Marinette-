// Initialisation AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        anchorPlacement: 'top-bottom',
        disable: function() {
            var maxWidth = 800;
            return window.innerWidth < maxWidth;
        }
    });
});

// Navigation dynamique
const navbar = document.querySelector('.navbar-fullwidth');
const hamburger = document.querySelector('.hamburger-modern');
const navMenu = document.querySelector('.nav-menu-dynamic');

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect pour les floating elements
    const floatingElements = document.querySelectorAll('.floating-icon');
    floatingElements.forEach((element, index) => {
        const speed = element.dataset.speed || 1;
        const yPos = -(scrollTop * speed * 0.5);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    lastScrollTop = scrollTop;
}, { passive: true });

// Menu mobile
if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animation du hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = hamburger.classList.contains('active') 
                ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 0 ? 6 : index === 2 ? -6 : 0}px, ${index === 0 ? 6 : index === 2 ? 6 : 0}px)`
                : 'rotate(0deg) translate(0px, 0px)';
            span.style.opacity = index === 1 && hamburger.classList.contains('active') ? '0' : '1';
        });
    });
}

// Smooth scrolling pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile si ouvert
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Animation des statistiques avec intersection Observer
const animateStatsOnScroll = () => {
    const statNumbers = document.querySelectorAll('.stat-number-dynamic, .metric-value-animated, .metric-number-hero, .stat-number-result');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateNumber(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
};

// Animation des nombres
function animateNumber(element) {
    const text = element.textContent.trim();
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasEuro = text.includes('€');
    const hasX = text.includes('x');
    
    let targetNumber = parseFloat(text.replace(/[^\d.]/g, ''));
    if (isNaN(targetNumber)) return;
    
    let startNumber = 0;
    const duration = 2000;
    const increment = targetNumber / (duration / 16);
    
    const animate = () => {
        startNumber += increment;
        
        if (startNumber >= targetNumber) {
            startNumber = targetNumber;
        }
        
        let displayNumber = Math.floor(startNumber);
        let formattedNumber = displayNumber;
        
        // Format selon le type
        if (hasEuro && targetNumber >= 1000000) {
            formattedNumber = '€' + (displayNumber / 1000000).toFixed(1) + 'M';
        } else if (hasEuro && targetNumber >= 1000) {
            formattedNumber = '€' + (displayNumber / 1000).toFixed(0) + 'K';
        } else if (hasEuro) {
            formattedNumber = '€' + displayNumber;
        } else if (hasPlus) {
            formattedNumber = '+' + displayNumber + (hasPercent ? '%' : '');
        } else if (hasX) {
            formattedNumber = (startNumber).toFixed(1) + 'x';
        } else if (hasPercent) {
            formattedNumber = displayNumber + '%';
        } else {
            formattedNumber = displayNumber + (targetNumber >= 15 ? '+' : '');
        }
        
        element.textContent = formattedNumber;
        
        if (startNumber < targetNumber) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

// Animation des barres de progression
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.dataset.width || '85';
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 500);
            }
        });
    }, {
        threshold: 0.5
    });
    
    progressBars.forEach(bar => {
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });
};

// Animation des barres de graphique
const animateChartBars = () => {
    const chartBars = document.querySelectorAll('.chart-bar-dynamic');
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.parentElement.querySelectorAll('.chart-bar-dynamic');
                
                bars.forEach((bar, index) => {
                    const height = bar.dataset.height || '50';
                    
                    setTimeout(() => {
                        bar.style.height = height + '%';
                        bar.style.transform = 'scaleY(1)';
                        bar.style.opacity = '1';
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    const chartContainers = document.querySelectorAll('.chart-animated');
    chartContainers.forEach(container => {
        const bars = container.querySelectorAll('.chart-bar-dynamic');
        bars.forEach(bar => {
            bar.style.height = '10px';
            bar.style.transform = 'scaleY(0)';
            bar.style.opacity = '0';
            bar.style.transformOrigin = 'bottom';
            bar.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        chartObserver.observe(container);
    });
};

// Animation du carousel de marques
const animateBrandsCarousel = () => {
    const carousel = document.querySelector('.brands-carousel');
    if (carousel) {
        const brands = carousel.querySelectorAll('.brand-item');
        
        brands.forEach((brand, index) => {
            brand.style.animationDelay = `${index * 0.2}s`;
            brand.classList.add('brand-animate');
        });
    }
};

// Parallax avancé pour le hero
const initHeroParallax = () => {
    const heroSection = document.querySelector('.hero-fullwidth');
    const heroVisual = document.querySelector('.dashboard-3d');
    const floatingCard = document.querySelector('.dashboard-floating-card');
    
    if (!heroSection || !heroVisual) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.05;
        const rotationRate = scrolled * 0.01;
        
        if (scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${rate}px)`;
            
            if (floatingCard) {
                floatingCard.style.transform = `
                    rotateY(${-10 + rotationRate}deg) 
                    rotateX(${5 + rotationRate * 0.5}deg) 
                    translateY(${rate * 1.5}px)
                `;
            }
        }
    }, { passive: true });
};

// Animation des particules sur les cartes de problème
const initProblemParticles = () => {
    const problemCards = document.querySelectorAll('.problem-card-dynamic');
    
    problemCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            const particles = card.querySelector('.problem-particles');
            if (particles) {
                particles.style.animation = `particleExpand 2s ease-in-out`;
            }
        });
        
        // Ajouter des particules flottantes
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        particlesContainer.innerHTML = Array.from({length: 3}, (_, i) => 
            `<div class="particle" style="animation-delay: ${i * 0.5}s"></div>`
        ).join('');
        
        card.appendChild(particlesContainer);
    });
};

// Gestion des formulaires avec animations
const initFormHandlers = () => {
    const primaryCTAs = document.querySelectorAll('.btn-primary-dynamic, .btn-cta-primary');
    const secondaryCTAs = document.querySelectorAll('.btn-secondary-dynamic, .btn-cta-secondary');
    
    const handleFormSubmission = async (button, formType) => {
        const originalText = button.querySelector('span').textContent;
        const icon = button.querySelector('i');
        
        // Animation du bouton
        button.style.transform = 'scale(0.95)';
        button.querySelector('span').textContent = 'Envoi en cours...';
        
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
        
        // Simulation d'envoi
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Animation de succès
        button.querySelector('span').textContent = '✓ Envoyé !';
        button.style.background = 'linear-gradient(135deg, #00C851, #00A843)';
        button.style.transform = 'scale(1)';
        
        if (icon) {
            icon.className = 'fas fa-check';
        }
        
        // Notification
        showNotification(`Demande de ${formType} envoyée avec succès ! 
            Nous vous recontacterons sous 24h.`, 'success');
        
        // Reset après 3 secondes
        setTimeout(() => {
            button.querySelector('span').textContent = originalText;
            button.style.background = '';
            if (icon) {
                icon.className = formType.includes('audit') ? 'fas fa-rocket' : 'fas fa-phone';
            }
        }, 3000);
    };
    
    primaryCTAs.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('audit')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFormSubmission(btn, 'audit gratuit');
            });
        }
    });
    
    secondaryCTAs.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('appel') || 
            btn.textContent.toLowerCase().includes('rdv')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFormSubmission(btn, 'rendez-vous stratégique');
            });
        }
    });
};

// Système de notifications avancé
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '🚀' : type === 'error' ? '❌' : 'ℹ️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 30px;
        background: ${type === 'success' ? 'var(--success-green)' : 
                    type === 'error' ? 'var(--error-red)' : 'var(--electric-blue)'};
        color: white;
        padding: 0;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        font-weight: 500;
        overflow: hidden;
        backdrop-filter: blur(10px);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        position: relative;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Barre de progression
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        transform-origin: left;
        animation: notificationProgress ${duration}ms linear forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationProgress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
    `;
    document.head.appendChild(style);
    
    notification.appendChild(progressBar);
    
    // Fermeture automatique
    const autoClose = setTimeout(() => {
        closeNotification();
    }, duration);
    
    const closeNotification = () => {
        clearTimeout(autoClose);
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 400);
    };
    
    // Fermeture manuelle
    closeBtn.addEventListener('click', closeNotification);
    
    // Fermeture au clic
    notification.addEventListener('click', closeNotification);
}

// Animation des éléments au hover
const initHoverEffects = () => {
    // Cartes de service compactes
    const serviceCards = document.querySelectorAll('.service-compact-dynamic');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const hoverEffect = card.querySelector('.service-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.transform = 'translateX(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const hoverEffect = card.querySelector('.service-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.transform = 'translateX(-100%)';
            }
        });
    });
    
    // Liens de navigation avec effet de vague
    const navLinks = document.querySelectorAll('.nav-link-animated');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = link.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                bottom: -10px;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--electric-blue);
                transform: scaleX(0);
                animation: linkRipple 0.3s ease forwards;
            `;
            
            link.style.position = 'relative';
            link.appendChild(ripple);
            
            setTimeout(() => {
                if (link.contains(ripple)) {
                    link.removeChild(ripple);
                }
            }, 300);
        });
    });
};

// Intersection Observer pour les animations avancées
const initAdvancedAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animation spécifique selon la classe
                if (element.classList.contains('stat-card-animated')) {
                    element.style.transform = 'translateY(-10px)';
                    element.style.boxShadow = '0 25px 60px rgba(0, 102, 255, 0.15)';
                }
                
                if (element.classList.contains('problem-card-dynamic')) {
                    element.style.transform = 'translateY(-15px) scale(1.02)';
                }
                
                if (element.classList.contains('service-compact-dynamic')) {
                    element.style.transform = 'translateY(-8px)';
                    element.style.borderColor = 'var(--electric-blue)';
                }
                
                // Marquer comme animé
                element.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    document.querySelectorAll(`
        .stat-card-animated,
        .problem-card-dynamic,
        .service-compact-dynamic,
        .step-content-animated,
        .result-hero-card,
        .stat-card-result
    `).forEach(el => {
        observer.observe(el);
    });
};

// Performance monitoring et optimisations
const initPerformanceOptimizations = () => {
    // Lazy loading des images si présentes
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    // Optimisation des animations selon les préférences utilisateur
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = '0.01ms !important';
            el.style.animationIterationCount = '1 !important';
            el.style.transitionDuration = '0.01ms !important';
        });
    }
};

// Logger de performance
const logPerformanceMetrics = () => {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const paintMetrics = performance.getEntriesByType('paint');
                
                console.log('🚀 Marinette Performance Metrics:');
                console.log(`⚡ DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`);
                console.log(`🎨 First Paint: ${Math.round(paintMetrics[0]?.startTime || 0)}ms`);
                console.log(`🖼️ First Contentful Paint: ${Math.round(paintMetrics[1]?.startTime || 0)}ms`);
                console.log(`📄 Page Load Complete: ${Math.round(perfData.loadEventEnd - perfData.navigationStart)}ms`);
                
                // Métriques de performance pour optimisation
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                if (loadTime > 3000) {
                    console.warn('⚠️ Page load time is above 3 seconds. Consider optimization.');
                } else {
                    console.log('✅ Page load performance is optimal!');
                }
            }, 100);
        });
    }
};

// Initialisation de tous les modules
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Marinette - Initialisation du site dynamique...');
    
    // Initialiser toutes les fonctionnalités
    animateStatsOnScroll();
    animateProgressBars();
    animateChartBars();
    animateBrandsCarousel();
    initHeroParallax();
    initProblemParticles();
    initFormHandlers();
    initHoverEffects();
    initAdvancedAnimations();
    initPerformanceOptimizations();
    logPerformanceMetrics();
    
    // Animation d'entrée pour les éléments critiques
    setTimeout(() => {
        const criticalElements = document.querySelectorAll('.hero-badge-animated, .hero-title-dynamic');
        criticalElements.forEach((el, index) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
    
    console.log('🎉 Marinette - Site dynamique chargé avec succès!');
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Marinette JS Error:', e.error);
    
    // En production, on pourrait envoyer les erreurs à un service de monitoring
    // sendErrorToMonitoring(e.error);
});

// CSS dynamique pour les animations personnalisées
const dynamicCSS = `
    <style>
        @keyframes linkRipple {
            to { transform: scaleX(1); }
        }
        
        .brand-animate {
            animation: brandFadeIn 0.6s ease forwards;
        }
        
        @keyframes brandFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .floating-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(0, 102, 255, 0.3);
            border-radius: 50%;
            animation: floatParticle 4s ease-in-out infinite;
        }
        
        .particle:nth-child(1) { top: 20%; left: 20%; }
        .particle:nth-child(2) { top: 60%; right: 20%; }
        .particle:nth-child(3) { bottom: 20%; left: 60%; }
        
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) opacity(0.3); }
            50% { transform: translate(15px, -15px) opacity(0.6); }
        }
        
        .hamburger-modern.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .hamburger-modern.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger-modern.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
        
        /* Mobile menu styles */
        .nav-menu-dynamic.active {
            position: fixed;
            top: 80px;
            right: 0;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            font-size: 1.2rem;
            z-index: 9999;
        }
        
        @media (max-width: 768px) {
            .nav-menu-dynamic {
                display: none;
            }
            
            .nav-menu-dynamic.active {
                display: flex;
            }
            
            .hamburger-modern {
                display: flex;
                flex-direction: column;
                cursor: pointer;
                z-index: 10000;
            }
            
            .hamburger-modern span {
                width: 25px;
                height: 3px;
                background: var(--electric-blue);
                margin: 3px 0;
                transition: all 0.3s ease;
            }
        }
    </style>
`;

// Injecter le CSS dynamique
document.head.insertAdjacentHTML('beforeend', dynamicCSS);
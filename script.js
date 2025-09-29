// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Fermer le menu mobile quand on clique sur un lien
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth scrolling pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer pour les animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.service-compact, .service-large, .step-modern, .result-card, .problem-card').forEach(el => {
    observer.observe(el);
});

// Animation des métriques au chargement
function animateCounters() {
    const counters = document.querySelectorAll('.stat-inline strong, .metric-value, .result-metric .number, .result-stat .stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent.trim();
        
        // Skip si ce n'est pas un nombre
        if (!/[\d.,]/.test(target)) return;
        
        const updateCounter = () => {
            const targetValue = parseFloat(target.replace(/[^\d.]/g, ''));
            if (isNaN(targetValue)) return;
            
            const increment = targetValue / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    const prefix = target.match(/[€+]/)?.[0] || '';
                    const suffix = target.match(/[%xM]/)?.[0] || '';
                    counter.textContent = prefix + Math.floor(current) + suffix;
                }
            }, 20);
        };
        
        // Démarrer l'animation quand l'élément est visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Animation des barres de graphique
function animateCharts() {
    const chartBars = document.querySelectorAll('.bar');
    
    chartBars.forEach((bar, index) => {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.transform = 'scaleY(1)';
                        bar.style.opacity = '1';
                    }, index * 100);
                    chartObserver.unobserve(entry.target);
                }
            });
        });
        
        bar.style.transformOrigin = 'bottom';
        bar.style.transform = 'scaleY(0)';
        bar.style.opacity = '0';
        bar.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        chartObserver.observe(bar);
    });
}

// Parallax effect léger sur le hero
let ticking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && scrolled < window.innerHeight) {
        const rate = scrolled * -0.05;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
}

function requestParallax() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallax);

// Navbar scroll effect
let lastScrollTop = 0;
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollTop = scrollTop;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Gestion des formulaires améliorée
function handleFormSubmission(formType, buttonElement) {
    const originalText = buttonElement.textContent;
    
    // Animation du bouton
    buttonElement.textContent = 'Envoi en cours...';
    buttonElement.style.opacity = '0.7';
    buttonElement.style.pointerEvents = 'none';
    
    // Simulation d'envoi
    setTimeout(() => {
        buttonElement.textContent = '✓ Envoyé !';
        buttonElement.style.background = 'var(--success-green)';
        
        setTimeout(() => {
            showNotification(`Demande de ${formType} envoyée ! Nous vous recontacterons sous 24h.`, 'success');
            buttonElement.textContent = originalText;
            buttonElement.style.opacity = '1';
            buttonElement.style.pointerEvents = 'auto';
            buttonElement.style.background = '';
        }, 1500);
    }, 1000);
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--electric-blue)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Event listeners pour les CTAs
document.addEventListener('DOMContentLoaded', () => {
    // Boutons d'audit gratuit
    document.querySelectorAll('[href="#"], .btn-primary-large').forEach(btn => {
        if (btn.textContent.toLowerCase().includes('audit')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFormSubmission('audit gratuit', btn);
            });
        }
    });
    
    // Boutons de RDV
    document.querySelectorAll('.btn-secondary-outline').forEach(btn => {
        if (btn.textContent.toLowerCase().includes('appel') || btn.textContent.toLowerCase().includes('rdv')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleFormSubmission('rendez-vous stratégique', btn);
            });
        }
    });
    
    // Animation initiale des compteurs et graphiques
    setTimeout(() => {
        animateCounters();
        animateCharts();
    }, 500);
});

// Ajout de styles pour les animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-compact,
    .service-large,
    .step-modern,
    .result-card,
    .problem-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-compact:nth-child(2) { transition-delay: 0.1s; }
    .service-compact:nth-child(3) { transition-delay: 0.2s; }
    .service-compact:nth-child(4) { transition-delay: 0.3s; }
    
    @media (prefers-reduced-motion: reduce) {
        .service-compact,
        .service-large,
        .step-modern,
        .result-card,
        .problem-card {
            opacity: 1;
            transform: none;
        }
    }
`;
document.head.appendChild(style);

// Performance monitoring
const logPerformance = () => {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Marinette Performance Stats:');
                console.log(`⚡ DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`);
                console.log(`🎨 Page Load Complete: ${Math.round(perfData.loadEventEnd - perfData.navigationStart)}ms`);
            }, 0);
        });
    }
};

logPerformance();

// Gestion des erreurs JavaScript
window.addEventListener('error', (e) => {
    console.error('Marinette JS Error:', e.error);
});

console.log('✨ Marinette - Site modernisé chargé avec succès!');
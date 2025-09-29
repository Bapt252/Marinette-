// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

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

// Smooth scrolling pour les ancres
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

// Animation on scroll
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

// Observer les éléments à animer
document.querySelectorAll('.service-card, .step, .testimonial').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Animation des statistiques au chargement
window.addEventListener('load', () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        let current = 0;
        const increment = target.includes('%') ? 1 : target.includes('+') ? 1 : 1;
        
        const timer = setInterval(() => {
            if (target.includes('%')) {
                current += 1;
                stat.textContent = current + '%';
                if (current >= parseInt(target)) clearInterval(timer);
            } else if (target.includes('+')) {
                current += 1;
                stat.textContent = current + '+';
                if (current >= parseInt(target)) clearInterval(timer);
            } else if (target.includes('€')) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                current += 10;
                stat.textContent = current + '%';
                if (current >= 100) {
                    stat.textContent = '100%';
                    clearInterval(timer);
                }
            }
        }, 50);
    });
});

// Effet parallaxe léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Animation des barres de graphique dans la carte performance
window.addEventListener('load', () => {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 200);
    });
});

// Initialisation des barres de graphique
document.querySelectorAll('.chart-bar').forEach(bar => {
    bar.style.opacity = '0';
    bar.style.transform = 'scaleY(0)';
    bar.style.transformOrigin = 'bottom';
    bar.style.transition = 'all 0.5s ease';
});

// Gestion des formulaires (simulation)
function simulateFormSubmission(formType) {
    // Ici vous pouvez intégrer votre logique de formulaire
    alert(`Demande de ${formType} envoyée ! Nous vous recontacterons sous 24h.`);
}

// Ajout d'événements aux boutons CTA
document.addEventListener('DOMContentLoaded', () => {
    // Simulation de liens vers des formulaires
    const auditBtn = document.querySelector('.contact-option .btn-primary');
    const rdvBtn = document.querySelector('.contact-option .btn-secondary');
    
    if (auditBtn) {
        auditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            simulateFormSubmission('audit gratuit');
        });
    }
    
    if (rdvBtn) {
        rdvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            simulateFormSubmission('rendez-vous stratégique');
        });
    }
});

// Effet de typing pour le titre principal (optionnel)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Détection du scroll pour la navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 102, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

console.log('🚀 Marinette - Site loaded successfully!');
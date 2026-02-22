/**
 * Kudimu Insights - Landing Page JavaScript
 */

// Import CSS
import './landing.css';

// Smooth scroll for navigation links
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

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
        
        // Get form data
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            empresa: document.getElementById('empresa').value,
            mensagem: document.getElementById('mensagem').value
        };
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            
        } catch (error) {
            // Error
            alert('❌ Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por email.');
            console.error('Error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .step, .pricing-card, .impact-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('pt-AO');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('pt-AO');
        }
    }, 16);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetValue = statNumber.textContent.replace(/[^0-9]/g, '');
            animateCounter(statNumber, parseInt(targetValue));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Mobile menu toggle (if needed)
function createMobileMenu() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = `
            display: block;
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--roxo-profundo);
        `;
        
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
        
        nav.insertBefore(menuBtn, nav.querySelector('.nav-buttons'));
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Add loading class for better UX
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Easter egg - console message
console.log(`
%c🧠 Kudimu Insights
%cInteligência Coletiva Africana
%cDesenvolvido com 💜 em Angola

Interessado em trabalhar conosco?
Entre em contato: contato@kudimu.africa
`, 
'font-size: 24px; font-weight: bold; color: #6B2B9F;',
'font-size: 16px; color: #FF6B35;',
'font-size: 12px; color: #4CAF50;'
);

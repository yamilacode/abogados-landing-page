// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Inicializar todos los componentes
    initHamburgerMenu();
    initSmoothScroll();
    initContactForm();
    initModal();
    initLazyLoading();
    initNavbarScroll();
    initTypewriter();
});

// ===== MENÚ HAMBURGUESA CORREGIDO =====
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        // Click en hamburguesa
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevenir scroll cuando el menú está abierto
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Cerrar menú al clickear un link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }
}

// Scroll Suave
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        lastScroll = currentScroll;
    });
}

// Formulario de Contacto
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Loading state
        submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulación de envío (reemplazar con endpoint real)
            await simulateFormSubmission(data);
            
            // Mostrar modal de éxito
            showModal();
            form.reset();
            showToast('Mensaje enviado correctamente');
            
        } catch (error) {
            showToast('Error al enviar el mensaje', 'error');
            console.error('Error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Simulación de envío de formulario
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Datos del formulario:', data);
            resolve({ success: true });
        }, 2000);
    });
}

// Modal
function initModal() {
    const modal = document.getElementById('confirmModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalBtn = document.querySelector('.modal-btn');

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeBtn?.addEventListener('click', closeModal);
    modalBtn?.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#e74c3c';
        toast.style.color = 'white';
    } else {
        toast.style.background = 'var(--gold)';
        toast.style.color = 'black';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Lazy Loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antiguos
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Animación de entrada para elementos
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .glass');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Inicializar animaciones adicionales
setTimeout(animateOnScroll, 100);

// Performance optimization - Throttle scroll events
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
    }
}

// Validación de formulario en tiempo real
document.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea')) {
        validateField(e.target);
    }
});

function validateField(field) {
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error
    field.style.borderColor = 'var(--glass-border)';

    switch(fieldType) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value) && field.value !== '') {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;
        case 'text':
            if (field.name === 'name' && field.value.length < 3 && field.value !== '') {
                isValid = false;
                errorMessage = 'Nombre muy corto';
            }
            break;
        case 'textarea':
            if (field.value.length < 10 && field.value !== '') {
                isValid = false;
                errorMessage = 'Mensaje muy corto';
            }
            break;
    }

    if (!isValid) {
        field.style.borderColor = '#e74c3c';
    }

    return isValid;
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// Analytics placeholder (reemplazar con código real)
function initAnalytics() {
    // Google Analytics 4 u otra plataforma de análisis
    console.log('Analytics inicializado');
}

// Efecto Typewriter
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.getAttribute('data-text');
    let index = 0;
    
    // Limpiar el contenido inicial
    typewriterElement.textContent = '';
    
    function typeChar() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 120); // Velocidad de escritura
        } else {
            // Opcional: reiniciar después de una pausa
            setTimeout(() => {
                typewriterElement.textContent = '';
                index = 0;
                setTimeout(typeChar, 500);
            }, 3000);
        }
    }
    
    // Iniciar después de 1 segundo
    setTimeout(typeChar, 1000);
}

// Inicializar recursos críticos
preloadCriticalResources();
initAnalytics();

// Detectar cambio de tamaño de ventana
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Cerrar menú mobile si cambia a desktop
        if (window.innerWidth > 768) {
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }, 250);
});
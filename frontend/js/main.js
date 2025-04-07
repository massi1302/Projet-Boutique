const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du header transparent qui devient opaque au défilement
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animation pour faire apparaître les éléments au défilement
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.collection-banner, .footer-column');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Navigation vers la page d'accueil quand on clique sur le logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = '/templates/home.html';
        });
        logo.style.cursor = 'pointer';
    }
    
    // Navigation vers la page de profil quand on clique sur l'icône de profil
    const profileIcon = document.querySelector('.header-right img[alt="person-icon"]');
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            window.location.href = '/templates/profile.html';
        });
    }
    
    // Ajouter un effet de survol pour les icônes du header
    const headerIcons = document.querySelectorAll('.header-right img, .header-left img');
    headerIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Animation au défilement
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
    
    // Ajouter une classe active pour le menu
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer) {
        menuContainer.addEventListener('click', function() {
            this.classList.toggle('active');
            // Ici, vous pourriez ajouter code pour afficher un menu mobile
        });
    }
});
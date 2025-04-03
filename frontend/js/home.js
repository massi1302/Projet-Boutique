const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Récupération des bijoux depuis l'API
    fetchJewelry();
    
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
        const elements = document.querySelectorAll('.product-item, .collection-banner, .footer-column');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Ajouter des classes CSS pour l'animation
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`;
    });
    
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

// Fonction pour récupérer les bijoux de l'API
function fetchJewelry() {
    fetch(`${url}/jewelry`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bijoux');
            }
            return response.json();
        })
        .then(data => {
            // Afficher les bijoux dans la section des produits
            displayJewelry(data.jewelry);
            
            // Initialiser le Swiper après avoir chargé les produits
            initJewelrySwiper(data.jewelry);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Fonction pour afficher les bijoux dans la section des produits (grille)
function displayJewelry(jewelry) {
    const productGrid = document.querySelector('.product-grid');
    // Vider la grille de produits existante
    productGrid.innerHTML = '';
    
    // Filtrer les bijoux qui ont un nom et au moins une image
    const validJewelry = jewelry.filter(jewel => jewel.name && jewel.images && jewel.images.length > 0);
    
    // Limiter à 12 produits pour l'affichage en page d'accueil
    const limitedJewelry = validJewelry.slice(0, 12);
    
    limitedJewelry.forEach(jewel => {
        // Créer un élément pour chaque bijou
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        // Formatage du prix avec la devise
        const price = jewel.discount > 0 
            ? `<p class="price"><span class="original-price">${jewel.price}${jewel.currency}</span> ${(jewel.price * (1 - jewel.discount/100)).toFixed(2)}${jewel.currency}</p>`
            : `<p class="price">${jewel.price}${jewel.currency}</p>`;
        
        // Utiliser la première image du bijou ou une image par défaut
        const imgSrc = jewel.images && jewel.images.length > 0 
            ? `${url}${jewel.images[0]}` 
            : `${url}/img/default.jpg`;
        
        // Structure HTML pour chaque produit (sans le bouton)
        productItem.innerHTML = `
            <img src="${imgSrc}" alt="${jewel.name}">
            <h3>${jewel.name}</h3>
            ${price}
        `;
        
        // Ajouter le style d'animation
        productItem.style.opacity = '0';
        productItem.style.transform = 'translateY(30px)';
        productItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Rendre l'élément cliquable pour la navigation
        productItem.style.cursor = 'pointer';
        productItem.addEventListener('click', () => {
            window.location.href = `product.html?id=${jewel.id}`;
        });
        
        // Ajouter l'élément au DOM
        productGrid.appendChild(productItem);
    });
    
    // Réappliquer l'animation pour les nouveaux éléments
    setTimeout(() => {
        const newProducts = document.querySelectorAll('.product-item');
        newProducts.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100); // Décalage pour chaque élément
        });
    }, 100);
}

// Fonction pour initialiser le Swiper
function initJewelrySwiper(jewelry) {
    // S'assurer que Swiper est chargé
    if (typeof Swiper === 'undefined') {
        console.error('Swiper n\'est pas chargé. Vérifiez que le script est correctement inclus.');
        return;
    }
    
    // Sélectionner le conteneur des slides
    const swiperWrapper = document.querySelector('.jewelrySwiper .swiper-wrapper');
    
    
    // Fonction pour faire défiler automatiquement
    function startAutoScroll() {
        // Réinitialiser position si nécessaire
        if (parseInt(swiperWrapper.style.transform.split('translateX(')[1]) <= -3000) {
            swiperWrapper.style.transition = 'none';
            swiperWrapper.style.transform = 'translateX(0px)';
            // Force repaint
            swiperWrapper.offsetHeight;
        }
        
        // Appliquer une transition fluide
        swiperWrapper.style.transition = 'transform 30s linear';
        
        // Calculer la position finale en fonction du nombre de slides
        const finalPosition = -(swiperWrapper.scrollWidth / 2); // Déplace jusqu'à la moitié pour assurer la boucle
        swiperWrapper.style.transform = `translateX(${finalPosition}px)`;
    }
    
    // Démarrer le défilement automatique
    function initAutoScroll() {
        // Configuration initiale
        swiperWrapper.style.transform = 'translateX(0px)';
        swiperWrapper.style.transition = 'none';
        
        // Démarrer le premier défilement
        setTimeout(startAutoScroll, 100);
        
        // Redémarrer le défilement à la fin de l'animation
        swiperWrapper.addEventListener('transitionend', function() {
            // Réinitialiser sans transition
            swiperWrapper.style.transition = 'none';
            swiperWrapper.style.transform = 'translateX(0px)';
            
            // Force repaint
            swiperWrapper.offsetHeight;
            
            // Redémarrer
            setTimeout(startAutoScroll, 50);
        });
    }
    
    const swiperContainer = document.querySelector('.jewelrySwiper');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', function() {
            swiperWrapper.style.transition = 'none';
            // Capture la position actuelle lors de la pause
            const currentTransform = swiperWrapper.style.transform;
            swiperWrapper.style.transform = currentTransform;
        });
        
        swiperContainer.addEventListener('mouseleave', function() {
            startAutoScroll();
        });
    }
    
    // Initialiser le défilement automatique
    initAutoScroll();

    if (!swiperWrapper) {
        console.error('Le conteneur Swiper n\'a pas été trouvé dans le DOM.');
        return;
    }
    
    // Vider le conteneur
    swiperWrapper.innerHTML = '';
    
    // Filtrer les bijoux valides (avec nom et images)
    const validJewelry = jewelry.filter(jewel => jewel.name && jewel.images && jewel.images.length > 0);
    
    // Ajouter chaque bijou comme slide
    validJewelry.forEach(jewel => {
        // Créer un nouveau slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        // Formatage du prix avec réduction si applicable
        const price = jewel.discount > 0 
            ? `<p class="price"><span class="original-price">${jewel.price}${jewel.currency}</span> ${(jewel.price * (1 - jewel.discount/100)).toFixed(2)}${jewel.currency}</p>`
            : `<p class="price">${jewel.price}${jewel.currency}</p>`;
        
        // Utiliser la première image ou une image par défaut
        const imgSrc = jewel.images && jewel.images.length > 0 
            ? `${url}${jewel.images[0]}` 
            : `${url}/img/default.jpg`;
        
        // Structure HTML du slide
        slide.innerHTML = `
            <img src="${imgSrc}" alt="${jewel.name}">
            <div class="product-info">
                <h3>${jewel.name}</h3>
                ${price}
            </div>
        `;
        
        // Rendre le slide cliquable
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
            window.location.href = `product.html?id=${jewel.id}`;
        });
        
        // Ajouter le slide au wrapper
        swiperWrapper.appendChild(slide);
    });
    
    const jewelrySwiper = new Swiper('.jewelrySwiper', {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Responsive breakpoints
        breakpoints: {
            // ≥ 640px (petit écran)
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // ≥ 768px (tablette)
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            // ≥ 1024px (desktop)
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
        },
        
        // Suppression de l'autoplay standard
        // À la place, nous utilisons une animation CSS
        speed: 0,
        allowTouchMove: true,
        
        // Accessibilité
        a11y: {
            prevSlideMessage: 'Produit précédent',
            nextSlideMessage: 'Produit suivant',
            firstSlideMessage: 'Premier produit',
            lastSlideMessage: 'Dernier produit',
            paginationBulletMessage: 'Aller au produit {{index}}',
        },
        
        // Navigation au clavier
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
    });
    
    
}
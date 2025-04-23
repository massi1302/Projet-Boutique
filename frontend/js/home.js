const url = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function () {
    // Récupération des bijoux depuis l'API
    fetchJewelry();
    
    // Configuration des contrôles pour le carousel CSS
    setupCarouselControls();
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
            // Initialiser le carrousel CSS
            initJewelryCarousel(data.jewelry);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Configuration des contrôles pour le carousel CSS
function setupCarouselControls() {
    // Gestion des boutons suivant/précédent
    document.addEventListener('click', function(e) {
        if (e.target.closest('.swiper-button-next')) {
            moveCarousel('next');
            e.preventDefault();
        } else if (e.target.closest('.swiper-button-prev')) {
            moveCarousel('prev');
            e.preventDefault();
        } else if (e.target.classList.contains('swiper-pagination-bullet')) {
            // Gérer la pagination
            const bullets = document.querySelectorAll('.swiper-pagination-bullet');
            const index = Array.from(bullets).indexOf(e.target);
            
            // Mise à jour de la classe active
            bullets.forEach((bullet, i) => {
                bullet.classList.toggle('swiper-pagination-bullet-active', i === index);
            });
            
            // Déplacer le carousel à la position correspondante
            const totalSections = bullets.length;
            moveCarouselToPosition(index / totalSections);
        }
    });
}

// Fonction pour déplacer le carousel manuellement
function moveCarousel(direction) {
    const carousel = document.querySelector('.swiper-wrapper');
    if (!carousel) return;
    
    // Arrêter l'animation
    carousel.style.animationPlayState = 'paused';
    
    // Récupérer la position actuelle
    const computedStyle = window.getComputedStyle(carousel);
    const transform = computedStyle.getPropertyValue('transform');
    const matrix = new DOMMatrix(transform);
    const currentPosition = matrix.m41; // La valeur de translation X
    
    // Calculer le déplacement
    const slideWidth = document.querySelector('.swiper-slide').offsetWidth + 20; // 20px de marge
    const move = direction === 'next' ? -slideWidth : slideWidth;
    
    // Appliquer le nouveau déplacement
    carousel.style.transform = `translateX(${currentPosition + move}px)`;
}

// Déplacer le carousel à une position spécifique (0-1)
function moveCarouselToPosition(percentage) {
    const carousel = document.querySelector('.swiper-wrapper');
    if (!carousel) return;
    
    // Arrêter l'animation
    carousel.style.animationPlayState = 'paused';
    
    // Calculer le max scroll (basé sur l'animation)
    const slideWidth = document.querySelector('.swiper-slide').offsetWidth + 20;
    const totalWidth = slideWidth * 10; // Correspondant à l'animation CSS
    
    // Appliquer la nouvelle position
    carousel.style.transform = `translateX(${-percentage * totalWidth}px)`;
}

// Fonction pour initialiser le carousel CSS avec les produits
function initJewelryCarousel(jewelry) {
    // Sélectionner le conteneur
    const swiperWrapper = document.querySelector('.jewelrySwiper .swiper-wrapper');
    
    if (!swiperWrapper) {
        console.error('Le conteneur Swiper n\'a pas été trouvé dans le DOM.');
        return;
    }
    
    // Vider le conteneur
    swiperWrapper.innerHTML = '';
    
    // Filtrer les bijoux valides (avec nom et images)
    const validJewelry = jewelry.filter(jewel => jewel.name && jewel.images && jewel.images.length > 0);
    
    // Générer les slides
    validJewelry.forEach(jewel => {
        // Créer un nouveau slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.dataset.jewelId = jewel.id;
        
        // Formatage du prix avec réduction si applicable
        const price = jewel.discount > 0
            ? `<p class="price"><span class="original-price">${jewel.price}${jewel.currency}</span> ${(jewel.price * (1 - jewel.discount / 100)).toFixed(2)}${jewel.currency}</p>`
            : `<p class="price">${jewel.price}${jewel.currency}</p>`;
            
        // Utiliser la première image ou une image par défaut
        const imgSrc = jewel.images && jewel.images.length > 0
            ? `${url}${jewel.images[0]}`
            : `${url}/img/default.jpg`;
            
        // Badge pour les produits en promotion
        const discountBadge = jewel.discount > 0
            ? `<div class="product-badge">-${jewel.discount}%</div>`
            : '';
            
        // Structure HTML pour le slide
        slide.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    ${discountBadge}
                    <img src="${imgSrc}" alt="${jewel.name}">
                    <div class="add-to-cart">Ajouter au panier</div>
                </div>
                <div class="product-info">
                    <h3>${jewel.name}</h3>
                    ${price}
                </div>
            </div>
        `;
        
        // Gérer les clics sur le slide
        slide.addEventListener('click', (e) => {
            // Ne pas naviguer si on clique sur le coeur ou le bouton d'ajout au panier
            if (e.target.closest('.favorite-icon') || e.target.closest('.add-to-cart')) {
                e.stopPropagation();
                return;
            }
            window.location.href = `../templates/product.html?id=${jewel.id}`;
        });
        
        // Ajouter le slide au wrapper
        swiperWrapper.appendChild(slide);
    });
    
    // Dupliquer les slides pour l'effet infini
    const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        
        // Ajouter les mêmes event listeners au clone
        clone.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-icon') || e.target.closest('.add-to-cart')) {
                e.stopPropagation();
                return;
            }
            const jewelId = slide.dataset.jewelId;
            window.location.href = `../templates/product.html?id=${jewelId}`;
        });
        
        swiperWrapper.appendChild(clone);
    });
    
    // Créer les éléments de pagination
    createPaginationBullets(Math.min(5, Math.ceil(validJewelry.length / 4)));
}

// Créer les éléments de pagination
function createPaginationBullets(count) {
    const paginationContainer = document.querySelector('.swiper-pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const bullet = document.createElement('span');
        bullet.className = 'swiper-pagination-bullet';
        if (i === 0) bullet.classList.add('swiper-pagination-bullet-active');
        paginationContainer.appendChild(bullet);
    }
}
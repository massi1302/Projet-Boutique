document.addEventListener('DOMContentLoaded', function () {
    // Récupération des bijoux depuis l'API
    fetchJewelry();
});

// Fonction pour récupérer les bijoux de l'API
function fetchJewelry() {
    fetch(`${window.API_URL}/jewelry`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bijoux');
            }
            return response.json();
        })
        .then(data => {
            // Initialiser les bijoux dans le carrousel Swiper
            initJewelryCarousel(data.jewelry);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Fonction pour initialiser le carousel avec les produits
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
            
        // Stocker toutes les images du produit dans un attribut data
        const allImages = jewel.images && jewel.images.length > 0 
            ? jewel.images.map(img => `${window.API_URL}${img}`)
            : [`${window.API_URL}/img/default.jpg`];
            
        // Utiliser la première image comme image par défaut
        const imgSrc = allImages[0];
            
        // Vérifier si le produit est dans les favoris - utiliser la fonction centralisée
        const isFavorite = isInFavorites(jewel.id);
        const favoriteIcon = isFavorite ? '../icons/favorite.png' : '../icons/favorite_border.png';

        // Badge pour les produits en promotion
        const discountBadge = jewel.discount > 0
            ? `<div class="product-badge">-${jewel.discount}%</div>`
            : '';
            
        // Structure HTML pour le slide
        slide.innerHTML = `
        <div class="product-card">
            <div class="product-image" data-images='${JSON.stringify(allImages)}' data-current-index="0">
                ${discountBadge}
                <div class="favorite-icon product-badge" data-id="${jewel.id}" style="right: 10px; left: auto;">
                    <img src="${favoriteIcon}" alt="Favoris" class="${isFavorite ? 'favorite-active' : ''}">
                </div>
                <img src="${imgSrc}" alt="${jewel.name}" class="product-main-image">
                <div class="product-actions">
                    <div class="add-to-cart">Ajouter au panier</div>
                </div>
            </div>
            <div class="product-info">
                <h3>${jewel.name}</h3>
                ${price}
            </div>
        </div>
        `;
        
        // Ajouter le slide au wrapper
        swiperWrapper.appendChild(slide);
    });

    // Initialiser Swiper après avoir ajouté tous les slides
    initSwiper();
}

// Fonction pour initialiser Swiper
function initSwiper() {
    // Détruire l'instance existante si elle existe
    if (window.jewelrySwiper) {
        window.jewelrySwiper.destroy(true, true);
    }
    
    // Créer une nouvelle instance Swiper avec les options souhaitées
    window.jewelrySwiper = new Swiper('.jewelrySwiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            }
        }
    });
    
    // Ajouter les événements sur les éléments du carousel
    addCarouselEvents();
}


// Ajouter les événements pour les favoris et autres actions
function addCarouselEvents() {
    const slides = document.querySelectorAll('.swiper-slide');
    
    slides.forEach(slide => {
        const productImage = slide.querySelector('.product-image');
        const mainImage = slide.querySelector('.product-main-image');
        
        // Gérer le hover sur l'image du produit
        productImage.addEventListener('mouseenter', function() {
            // Arrêter l'autoplay du Swiper
            if (window.jewelrySwiper && window.jewelrySwiper.autoplay) {
                window.jewelrySwiper.autoplay.stop();
            }
            
            // Changer pour la deuxième image si disponible
            if (this.dataset.images) {
                const images = JSON.parse(this.dataset.images);
                if (images.length > 1) {
                    // Passer simplement à la deuxième image
                    mainImage.style.opacity = '0.7';
                    setTimeout(() => {
                        mainImage.src = images[1]; // Afficher la seconde image
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            }
        });
        
        // Revenir à l'image originale quand la souris quitte le produit
        productImage.addEventListener('mouseleave', function() {
            // Redémarrer l'autoplay du Swiper
            if (window.jewelrySwiper && window.jewelrySwiper.autoplay) {
                window.jewelrySwiper.autoplay.start();
            }
            
            // Remettre la première image
            if (this.dataset.images) {
                const images = JSON.parse(this.dataset.images);
                mainImage.style.opacity = '0.7';
                setTimeout(() => {
                    mainImage.src = images[0]; // Revenir à l'image principale
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
        
        // Gérer les clics sur le slide
        slide.addEventListener('click', (e) => {
            const favoriteIcon = e.target.closest('.favorite-icon');
            if (favoriteIcon) {
                e.stopPropagation();
                const jewelId = parseInt(favoriteIcon.dataset.id, 10);
                
                // Basculer l'état des favoris avec la fonction centralisée
                const isNowFavorite = toggleFavorite(jewelId);
                
                // Mettre à jour l'icône
                const iconImg = favoriteIcon.querySelector('img');
                
                if (isNowFavorite) {
                    iconImg.src = '../icons/favorite_full.png';
                    iconImg.classList.add('favorite-active');
                } else {
                    iconImg.src = '../icons/favorite_empty.png';
                    iconImg.classList.remove('favorite-active');
                }
                
                return;
            }
            // Navigation vers la page de shopping cart
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (addToCartBtn) {
                e.stopPropagation();
                window.location.href = '../templates/shoppingCart.html'; 
            }
        
            // Navigation vers la page produit
            const jewelId = slide.dataset.jewelId;
            window.location.href = `../templates/product.html?id=${jewelId}`;
        });
    });
}
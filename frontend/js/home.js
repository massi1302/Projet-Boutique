

document.addEventListener('DOMContentLoaded', function () {
    // Récupération des bijoux depuis l'API
    fetchJewelry();
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
            // Initialiser uniquement le Swiper
            initJewelrySwiper(data.jewelry);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Fonction pour initialiser le Swiper avec les produits
function initJewelrySwiper(jewelry) {
    // S'assurer que Swiper est chargé
    if (typeof Swiper === 'undefined') {
        console.error('Swiper n\'est pas chargé. Vérifiez que le script est correctement inclus.');
        return;
    }

    // Sélectionner le conteneur des slides
    const swiperWrapper = document.querySelector('.jewelrySwiper .swiper-wrapper');

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

        // Structure HTML  pour le slide
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
            window.location.href = `/templates/product.html?id=${jewel.id}`;
        });

        // Ajouter le slide au wrapper
        swiperWrapper.appendChild(slide);
    });

    // Initialiser Swiper avec les bonnes options
    const jewelrySwiper = new Swiper('.jewelrySwiper', {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,

        // Autoplay standard de Swiper
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive breakpoints
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },

        // Amélioration de la fluidité
        speed: 600,
        effect: "slide",
    });
}




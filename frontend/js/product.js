// URL de l'API
const url = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = '../templates/home.html';
        return;
    }

    // Récupérer les détails du produit
    fetch(`${url}/jewelry/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Produit non trouvé');
            }
            return response.json();
        })
        .then(data => {
            // Afficher les détails du produit
            displayProductDetails(data.jewel);
            // Récupérer les produits similaires
            fetchSimilarProducts(data.jewel);
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Rediriger vers la page d'accueil en cas d'erreur
            window.location.href = '../templates/home.html';
        });

    // Initialiser les événements de la page            
    initPageEvents();
});

// Fonction pour afficher les détails du produit
function displayProductDetails(product) {
    // Mise à jour du titre de la page
    document.title = `${product.name} - Luce Preziosa`;

    // Mise à jour du fil d'Ariane
    document.getElementById('product-category').textContent = product.characteristics.type || 'Bijoux';
    document.getElementById('product-name').textContent = product.name;

    // Mise à jour du titre et des informations principales
    document.getElementById('product-title').textContent = product.name;

    // Gestion du prix et des réductions
    const currentPrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    if (product.discount > 0) {
        document.getElementById('original-price').textContent = `${product.price}${product.currency}`;
        document.getElementById('current-price').textContent = `${currentPrice.toFixed(2)}${product.currency}`;
        document.getElementById('discount-badge').textContent = `-${product.discount}%`;
    } else {
        document.getElementById('original-price').style.display = 'none';
        document.getElementById('current-price').textContent = `${product.price}${product.currency}`;
        document.getElementById('discount-badge').style.display = 'none';
    }

    // Mise à jour de la description
    const description = product.description || 'Aucune description disponible.';
    document.getElementById('product-description-short').textContent = description;
    document.getElementById('product-description-full').textContent = description;

    // Masquer le bouton "Lire plus" si la description est courte
    const readMoreBtn = document.getElementById('read-more-btn');
    if (description.length <= 150) {
        readMoreBtn.style.display = 'none';
    }

    // Mise à jour du stock
    document.getElementById('stock-quantity').textContent = product.quantity;

    // Display color options if available
    const colorOptions = document.getElementById('color-options');
    if (product.characteristics.availableColors && product.characteristics.availableColors.length > 0) {
        colorOptions.innerHTML = product.characteristics.availableColors.map(color => `
            <div class="color-option color-${color.toLowerCase()}" 
                 data-color="${color}"
                 title="${color.charAt(0).toUpperCase() + color.slice(1)}"
                 onclick="selectColor(this)">
            </div>
        `).join('');

        // Select first color by default
        const firstColor = colorOptions.querySelector('.color-option');
        if (firstColor) {
            firstColor.classList.add('active');
        }
    } else {
        document.querySelector('.product-colors').style.display = 'none';
    }

    // Affichage de la galerie d'images
    if (product.images && product.images.length > 0) {
        displayProductGallery(product.images);
    }

    // Affichage des caractéristiques du produit
    displayProductSpecs(product);

    // Vérifier si le produit est dans les favoris
    const wishlistBtn = document.getElementById('add-to-wishlist');
    const wishlistIcon = wishlistBtn.querySelector('img');
    if (isInFavorites(product.id)) {
        wishlistIcon.src = '../icons/favorite.png';
        wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Ajouter aux favoris', 'Retirer des favoris');
    }
}

// Fonction pour afficher la galerie d'images
function displayProductGallery(images) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('image-thumbnails');

    // Nettoyer le conteneur des miniatures
    thumbnailsContainer.innerHTML = '';

    // Afficher l'image principale
    mainImage.src = `${url}${images[0]}`;
    mainImage.setAttribute('data-index', '0');

    // Créer les miniatures
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${url}${image}" alt="Miniature ${index + 1}">`;

        thumbnail.addEventListener('click', () => {
            // Mettre à jour l'image principale
            mainImage.src = `${url}${image}`;
            mainImage.setAttribute('data-index', index);

            // Mettre à jour la classe active
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });

        thumbnailsContainer.appendChild(thumbnail);
    });

    // Configuration des boutons de navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => navigateGallery(-1, images));
    nextBtn.addEventListener('click', () => navigateGallery(1, images));
}

// Fonction pour naviguer dans la galerie
function navigateGallery(direction, images) {
    const mainImage = document.getElementById('main-product-image');
    const currentIndex = parseInt(mainImage.getAttribute('data-index'));
    const newIndex = (currentIndex + direction + images.length) % images.length;

    mainImage.src = `${url}${images[newIndex]}`;
    mainImage.setAttribute('data-index', newIndex);

    // Mise à jour des miniatures
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === newIndex);
    });
}

// Fonction pour afficher les caractéristiques du produit
function displayProductSpecs(product) {
    const specsList = document.getElementById('product-specs');
    specsList.innerHTML = '';

    const specs = [
        { label: 'Type', value: product.characteristics.type || 'Non spécifié' },
        { label: 'Genre', value: product.characteristics.gender === 'homme' ? 'Homme' : 'Femme' },
        { label: 'Matériaux', value: product.characteristics.material?.join(', ') || 'Non spécifié' }
    ];

    // Ajouter les caractéristiques spécifiques
    if (product.characteristics.chainLength) {
        specs.push({ label: 'Longueur', value: product.characteristics.chainLength });
    }
    if (product.characteristics.adjustable) {
        specs.push({ label: 'Ajustable', value: 'Oui' });
    }

    specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${spec.label}:</span> <span>${spec.value}</span>`;
        specsList.appendChild(li);
    });
}

// Fonction pour récupérer les produits similaires
function fetchSimilarProducts(currentProduct) {
    fetch(`${url}/jewelry`)
        .then(response => response.json())
        .then(data => {
            // Filtrer pour obtenir des produits similaires
            const similarProducts = data.jewelry
                .filter(product =>
                    product.id !== currentProduct.id &&
                    (product.characteristics.type === currentProduct.characteristics.type ||
                        product.characteristics.gender === currentProduct.characteristics.gender))
                .slice(0, 4);

            displaySimilarProducts(similarProducts);
        })
        .catch(error => console.error('Erreur:', error));
}

// Fonction pour afficher les produits similaires
function displaySimilarProducts(products) {
    const container = document.getElementById('similar-products');
    container.innerHTML = '';

    products.forEach(product => {
        const price = product.discount > 0
            ? `<span class="original-price">${product.price}${product.currency}</span> ${(product.price * (1 - product.discount / 100)).toFixed(2)}${product.currency}`
            : `${product.price}${product.currency}`;

        const card = document.createElement('div');
        card.className = 'similar-product-card';
        card.innerHTML = `
            <div class="similar-product-image">
                <img src="${url}${product.images[0]}" alt="${product.name}">
            </div>
            <div class="similar-product-info">
                <h3>${product.name}</h3>
                <p class="similar-product-price">${price}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        container.appendChild(card);
    });
}

// Initialisation des événements de la page
function initPageEvents() {
    // Gestion du bouton "Lire plus"
    const readMoreBtn = document.getElementById('read-more-btn');
    const shortDesc = document.getElementById('product-description-short');
    const fullDesc = document.getElementById('product-description-full');

    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            shortDesc.style.display = 'none';
            fullDesc.style.display = 'block';
            readMoreBtn.style.display = 'none';
        });
    }

    // Gestion de la quantité
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity-input');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            const maxStock = parseInt(document.getElementById('stock-quantity').textContent);
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
            }
        });

        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            const maxStock = parseInt(document.getElementById('stock-quantity').textContent);

            if (isNaN(value) || value < 1) value = 1;
            if (value > maxStock) value = maxStock;

            quantityInput.value = value;
        });
    }

    // Gestion du bouton d'ajout au panier
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = new URLSearchParams(window.location.search).get('id');
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const product = {
                id: parseInt(productId),
                name: document.getElementById('product-title').textContent,
                price: parseFloat(document.getElementById('current-price').textContent),
                image: document.getElementById('main-product-image').src,
                quantity: quantity
            };

            // Ajouter au panier
            window.addToCart(product);
        });
    }

    // Gestion des favoris
    const wishlistBtn = document.getElementById('add-to-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
            const isNowFavorite = toggleFavorite(productId);
            const icon = wishlistBtn.querySelector('img');

            if (isNowFavorite) {
                icon.src = '../icons/favorite.png';
                wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Ajouter aux favoris', 'Retirer des favoris');
            } else {
                icon.src = '../icons/favorite_border.png';
                wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Retirer des favoris', 'Ajouter aux favoris');
            }
        });
    }
}

function selectColor(element) {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });

    element.classList.add('active');

    const selectedColor = element.dataset.color;
    console.log('Selected color:', selectedColor);
}

window.selectColor = selectColor;
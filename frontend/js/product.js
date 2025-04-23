const url = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = '/templates/home.html';
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
            window.location.href = '/templates/home.html';
        });
    
    // Initialiser les événements de la page            
    initPageEvents();
});

// Ajouter cette fonction qui manquait
function initPageEvents() {
    // Gérer le bouton "Lire plus"
    const readMoreBtn = document.getElementById('read-more-btn');
    const shortDesc = document.getElementById('product-description-short');
    const fullDesc = document.getElementById('product-description-full');
    
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function() {
            shortDesc.style.display = 'none';
            fullDesc.style.display = 'block';
            readMoreBtn.style.display = 'none';
        });
    }
    
    // Gérer les contrôles de quantité
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity-input');
    const stockQuantity = document.getElementById('stock-quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            const maxStock = parseInt(stockQuantity.textContent);
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Valider la saisie manuelle
        quantityInput.addEventListener('change', function() {
            const currentValue = parseInt(quantityInput.value);
            const maxStock = parseInt(stockQuantity.textContent);
            
            if (isNaN(currentValue) || currentValue < 1) {
                quantityInput.value = 1;
            } else if (currentValue > maxStock) {
                quantityInput.value = maxStock;
            }
        });
    }
    
    // Gérer le bouton d'ajout au panier
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Récupérer les données du produit
            const productId = new URLSearchParams(window.location.search).get('id');
            const quantity = document.getElementById('quantity-input').value;
            const selectedColor = document.querySelector('.color-option.active')?.getAttribute('data-color');
            const selectedSize = document.querySelector('.size-option.active')?.getAttribute('data-size');
            
            // Ajouter au panier (simulé pour l'instant)
            alert('Produit ajouté au panier!');
            
            // Mettre à jour le compteur du panier
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                cartCount.textContent = parseInt(cartCount.textContent) + 1;
            }
        });
    }
    
    // Gérer le bouton d'ajout aux favoris
    const wishlistBtn = document.getElementById('add-to-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = wishlistBtn.querySelector('img');
            if (icon.src.includes('favorite_border.png')) {
                icon.src = '../icons/favorite.png';
                wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Ajouter aux favoris', 'Retiré des favoris');
            } else {
                icon.src = '../icons/favorite_border.png';
                wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Retiré des favoris', 'Ajouter aux favoris');
            }
        });
    }
}

// Fonction pour afficher les détails du produit
function displayProductDetails(product) {
    // Mise à jour des éléments simples
    document.title = `${product.name} - Luce Preziosa`;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.type || 'Bijoux';
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('currency').textContent = product.currency;
    document.getElementById('stock-quantity').textContent = product.stock;
    
    // Prix et réduction
    if (product.discount > 0) {
        document.getElementById('original-price').textContent = product.price;
        document.getElementById('current-price').textContent = (product.price * (1 - product.discount / 100)).toFixed(2);
        document.getElementById('discount-badge').textContent = `-${product.discount}%`;
    } else {
        document.getElementById('original-price').style.display = 'none';
        document.getElementById('current-price').textContent = product.price;
        document.getElementById('discount-badge').style.display = 'none';
    }
    
    // Description (tronquée à 150 caractères)
    const fullDescription = product.description;
    const shortDescription = fullDescription.length > 150 
        ? fullDescription.substring(0, 150) + '...' 
        : fullDescription;
    
    document.getElementById('product-description-short').textContent = shortDescription;
    document.getElementById('product-description-full').textContent = fullDescription;
    
    // Si la description est courte, masquer le bouton "Lire plus"
    if (fullDescription.length <= 150) {
        document.getElementById('read-more-btn').style.display = 'none';
    }
    
    // Afficher la galerie d'images
    displayProductGallery(product.images);
    
    // Afficher les options de couleur
    if (product.colors && product.colors.length > 0) {
        displayColorOptions(product.colors);
    } else {
        document.querySelector('.product-colors').style.display = 'none';
    }
    
    // Afficher les options de taille si disponibles
    if (product.sizes && product.sizes.length > 0) {
        displaySizeOptions(product.sizes);
    } else {
        document.getElementById('sizes-container').style.display = 'none';
    }
    
    // Afficher les caractéristiques du produit
    displayProductSpecs(product);
}

// Fonction pour afficher la galerie d'images
function displayProductGallery(images) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    
    // S'assurer que le tableau d'images existe et n'est pas vide
    if (!images || images.length === 0) {
        mainImage.src = `${url}/img/default.jpg`;
        return;
    }
    
    // Définir l'image principale
    mainImage.src = `${url}${images[0]}`;
    mainImage.setAttribute('data-index', 0);
    
    // Créer les miniatures
    thumbnailsContainer.innerHTML = '';
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${url}${image}" alt="Thumbnail ${index + 1}">`;
        
        // Ajouter l'événement de clic pour changer l'image principale
        thumbnail.addEventListener('click', () => {
            mainImage.src = `${url}${image}`;
            mainImage.setAttribute('data-index', index);
            
            // Mettre à jour la classe active
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Configurer les boutons de navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        navigateGallery(-1, images);
    });
    
    nextBtn.addEventListener('click', () => {
        navigateGallery(1, images);
    });
}

// Fonction pour naviguer dans la galerie
function navigateGallery(direction, images) {
    const mainImage = document.getElementById('main-product-image');
    let currentIndex = parseInt(mainImage.getAttribute('data-index'));
    let newIndex = (currentIndex + direction + images.length) % images.length;
    
    // Mettre à jour l'image principale
    mainImage.src = `${url}${images[newIndex]}`;
    mainImage.setAttribute('data-index', newIndex);
    
    // Mettre à jour la miniature active
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === newIndex);
    });
}

// Fonction pour afficher les options de couleur
function displayColorOptions(colors) {
    const colorContainer = document.getElementById('color-options');
    colorContainer.innerHTML = '';
    
    colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
        colorOption.style.backgroundColor = color;
        colorOption.setAttribute('data-color', color);
        
        colorOption.addEventListener('click', () => {
            // Mettre à jour la couleur active
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            colorOption.classList.add('active');
        });
        
        colorContainer.appendChild(colorOption);
    });
}

// Fonction pour afficher les options de taille
function displaySizeOptions(sizes) {
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = '';
    
    sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = `size-option ${index === 0 ? 'active' : ''}`;
        sizeOption.textContent = size;
        sizeOption.setAttribute('data-size', size);
        
        sizeOption.addEventListener('click', () => {
            // Ne pas sélectionner si désactivé
            if (sizeOption.classList.contains('disabled')) return;
            
            // Mettre à jour la taille active
            document.querySelectorAll('.size-option').forEach(option => {
                option.classList.remove('active');
            });
            sizeOption.classList.add('active');
        });
        
        sizeContainer.appendChild(sizeOption);
    });
}

// Fonction pour afficher les caractéristiques du produit
function displayProductSpecs(product) {
    const specsList = document.getElementById('product-specs');
    specsList.innerHTML = '';
    
    // Ajouter les caractéristiques standard
    const specs = [
        { label: 'Type', value: product.type || 'Non spécifié' },
        { label: 'Genre', value: product.gender || 'Unisexe' },
        { label: 'Matière', value: product.material || 'Non spécifié' }
    ];
    
    // Ajouter d'autres caractéristiques spécifiques si elles existent
    if (product.collection) specs.push({ label: 'Collection', value: product.collection });
    if (product.weight) specs.push({ label: 'Poids', value: `${product.weight} g` });
    
    // Créer des éléments de liste pour chaque caractéristique
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
            // Filtrer les produits similaires (même type ou même genre)
            let similarProducts = data.jewelry.filter(product => 
                product.id !== currentProduct.id && 
                (product.type === currentProduct.type || product.gender === currentProduct.gender)
            );
            
            // Limiter à 4 produits maximum
            similarProducts = similarProducts.slice(0, 4);
            
            // Afficher les produits similaires
            displaySimilarProducts(similarProducts);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des produits similaires:', error);
        });
}

// Fonction pour afficher les produits similaires
function displaySimilarProducts(products) {
    const container = document.getElementById('similar-products');
    container.innerHTML = '';
    
    if (products.length === 0) {
        document.querySelector('.similar-products').style.display = 'none';
        return;
    }
    
    products.forEach(product => {
        const cardElement = document.createElement('div');
        cardElement.className = 'similar-product-card';
        
        // Formatage du prix avec réduction si applicable
        const price = product.discount > 0
            ? `<span class="original-price">${product.price}${product.currency}</span> ${(product.price * (1 - product.discount / 100)).toFixed(2)}${product.currency}`
            : `${product.price}${product.currency}`;

            // Créer le HTML
        cardElement.innerHTML = `
            <a href="/templates/product.html?id=${product.id}">
                <img src="${url}${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${price}</p>
            </a>
        `;
        container.appendChild(cardElement);
    }

    );
    container.style.display = 'flex';
}


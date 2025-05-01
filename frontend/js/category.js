const url = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const gender = urlParams.get('gender');

    if (type && gender) {
        // Mettre à jour le titre et la description de la page
        updateCategoryHeader(type, gender);

        // Charger les produits correspondants
        fetchCategoryProducts(type, gender);
    } else {
        // Si les paramètres sont manquants, rediriger vers la page d'accueil
        window.location.href = '../templates/home.html';
    }

    // Configurer les filtres
    setupFilters();
});

// Mettre à jour l'en-tête de la catégorie
function updateCategoryHeader(type, gender) {
    const titleElement = document.getElementById('category-title');
    const descriptionElement = document.getElementById('category-description');

    // Capitaliser la première lettre
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const genderText = gender === 'men' ? "Men's" : "Women's";

    titleElement.textContent = `${genderText} ${capitalizedType}`;

    // Descriptions personnalisées selon le type de bijou
    const descriptions = {
        rings: "Discover our collection of exquisite rings, handcrafted with the finest materials.",
        earrings: "Elegant earrings that add a touch of sophistication to any outfit.",
        necklaces: "Beautiful necklaces that make a statement and elevate your style.",
        bracelets: "Stunning bracelets designed to complement your unique personality."
    };

    descriptionElement.textContent = descriptions[type] ||
        "Browse our selection of high-quality jewelry pieces.";
}

let allProducts = []; // Store all products for filtering

// Récupérer les produits de la catégorie depuis l'API
function fetchCategoryProducts(type, gender) {
    // Récupérer tous les bijoux
    fetch(`${url}/jewelry`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bijoux');
            }
            return response.json();
        })
        .then(data => {
            // Filtrer les bijoux selon le type et le genre
            allProducts = data.jewelry.filter(item => {
                return item.characteristics &&
                    item.characteristics.type === type &&
                    item.characteristics.gender === (gender === 'men' ? 'homme' : 'femme');
            });

            // Afficher les produits filtrés
            displayProducts(allProducts);

            // Initialize filter values
            initializeFilters(allProducts);
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('products-container').innerHTML =
                `<p class="error-message">Désolé, nous n'avons pas pu charger les produits. Veuillez réessayer plus tard.</p>`;
        });
}

function initializeFilters(products) {
    // Get unique materials
    const materials = [...new Set(products.flatMap(p => p.characteristics.material || []))];
    const materialContainer = document.getElementById('material-filters');

    materialContainer.innerHTML = materials.map(material => `
        <label>
            <input type="checkbox" value="${material}" class="material-filter"> 
            ${material}
        </label>
    `).join('');
}

// Configurer les filtres
function setupFilters() {
    const sortFilter = document.getElementById('sort-filter');
    const priceFilters = document.querySelectorAll('.price-filter');
    const materialFilters = document.getElementById('material-filters');

    // Event listeners for all filters
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    priceFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    materialFilters.addEventListener('change', applyFilters);
}

function applyFilters() {
    let filteredProducts = [...allProducts];

    // Apply price filters
    const selectedPriceRanges = Array.from(document.querySelectorAll('.price-filter:checked')).map(input => input.value);
    if (selectedPriceRanges.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            return selectedPriceRanges.some(range => {
                const [min, max] = range.split('-').map(Number);
                return price >= min && (!max || price <= max);
            });
        });
    }

    // Apply material filters
    const selectedMaterials = Array.from(document.querySelectorAll('.material-filter:checked')).map(input => input.value);
    if (selectedMaterials.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return product.characteristics.material?.some(material => selectedMaterials.includes(material));
        });
    }

    // Apply sorting
    const sortValue = document.getElementById('sort-filter').value;
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    // Display filtered products
    displayProducts(filteredProducts);
}

// Afficher les produits dans la grille
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `<p class="no-products">Aucun produit trouvé dans cette catégorie.</p>`;
        return;
    }

    products.forEach(product => {
        // Formater le prix avec remise si applicable
        const price = product.discount > 0
            ? `<p class="price"><span class="original-price">${product.price}${product.currency}</span> ${(product.price * (1 - product.discount / 100)).toFixed(2)}${product.currency}</p>`
            : `<p class="price">${product.price}${product.currency}</p>`;

        // Badge pour les produits en promotion
        const discountBadge = product.discount > 0
            ? `<div class="product-badge">-${product.discount}%</div>`
            : '';

        // Utiliser la première image ou une image par défaut
        const imgSrc = product.images && product.images.length > 0
            ? `${url}${product.images[0]}`
            : `${url}/img/default.jpg`;

        // Créer la carte de produit
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${discountBadge}
                <img src="${imgSrc}" alt="${product.name}">
                <div class="add-to-cart">Ajouter au panier</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${price}
            </div>
        `;

        // Ajouter un événement de clic pour naviguer vers la page de détail
        productCard.addEventListener('click', (e) => {
            // Ne pas naviguer si on clique sur le bouton d'ajout au panier
            if (e.target.closest('.add-to-cart')) {
                e.stopPropagation();
                return;
            }
            window.location.href = `../templates/product.html?id=${product.id}`;
        });

        container.appendChild(productCard);
    });
}
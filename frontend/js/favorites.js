document.addEventListener('DOMContentLoaded', function() {
    // Charger les favoris depuis le localStorage
    loadFavorites();
    
    // Mettre à jour le compteur de favoris (maintenant via la fonction globale)
    updateFavoritesCounter();
});

// Fonction pour charger les favoris depuis le localStorage
function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const emptyFavoritesMessage = document.getElementById('empty-favorites');
    
    if (!favoritesContainer || !emptyFavoritesMessage) return;
    
    // Récupérer les favoris depuis la fonction centralisée
    const favorites = getFavoritesFromStorage();
    
    // Mise à jour du compteur dans l'interface
    updateFavoritesCounter();
    
    // Si aucun favori, afficher le message
    if (favorites.length === 0) {
        emptyFavoritesMessage.classList.remove('hidden');
        return;
    }
    
    // Masquer le message "vide" si on a des favoris
    emptyFavoritesMessage.classList.add('hidden');
    
    // Vider le conteneur avant d'ajouter les éléments
    while (favoritesContainer.firstChild && favoritesContainer.firstChild !== emptyFavoritesMessage) {
        favoritesContainer.removeChild(favoritesContainer.firstChild);
    }
    
    // Créer la grille pour afficher les produits favoris
    const gridContainer = document.createElement('div');
    gridContainer.className = 'favorites-grid';
    favoritesContainer.insertBefore(gridContainer, emptyFavoritesMessage);
    
    // Récupérer tous les bijoux pour trouver ceux qui sont dans les favoris
    fetch(`${window.API_URL}/jewelry`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bijoux');
            }
            return response.json();
        })
        .then(data => {
            // Filtrer les bijoux qui sont dans les favoris
            const favoriteJewelry = data.jewelry.filter(jewel => 
                favorites.includes(parseInt(jewel.id, 10))
            );
            
            // Si on ne trouve aucun des bijoux favoris dans l'API
            if (favoriteJewelry.length === 0) {
                emptyFavoritesMessage.classList.remove('hidden');
                gridContainer.remove();
                return;
            }
            
            // Afficher chaque bijou favori
            favoriteJewelry.forEach(jewel => {
                const card = createFavoriteCard(jewel);
                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Afficher un message d'erreur
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Une erreur est survenue lors du chargement de vos favoris.';
            favoritesContainer.insertBefore(errorMessage, emptyFavoritesMessage);
        });
}

// Fonction pour créer une carte de produit favori
function createFavoriteCard(jewel) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.dataset.jewelId = jewel.id;
    
    // Formatage du prix avec réduction si applicable
    const price = jewel.discount > 0
        ? `<p class="price"><span class="original-price">${jewel.price}${jewel.currency}</span> ${(jewel.price * (1 - jewel.discount / 100)).toFixed(2)}${jewel.currency}</p>`
        : `<p class="price">${jewel.price}${jewel.currency}</p>`;
        
    // Utiliser la première image ou une image par défaut
    const imgSrc = jewel.images && jewel.images.length > 0
        ? `${window.API_URL}${jewel.images[0]}`
        : `${window.API_URL}/img/default.jpg`;
        
    // Badge pour les produits en promotion
    const discountBadge = jewel.discount > 0
        ? `<div class="product-badge">-${jewel.discount}%</div>`
        : '';
        
    // Structure HTML pour la carte
    card.innerHTML = `
        <div class="favorite-image">
            ${discountBadge}
            <img src="${imgSrc}" alt="${jewel.name}">
            <div class="favorite-actions">
                <button class="add-to-cart-btn">Ajouter au panier</button>
                <button class="remove-favorite-btn">
                    <img src="../icons/close.png" alt="Supprimer">
                </button>
            </div>
        </div>
        <div class="favorite-info">
            <h3>${jewel.name}</h3>
            ${price}
            <p class="favorite-type">${jewel.characteristics ? jewel.characteristics.type : 'Bijou'}</p>
        </div>
    `;
    
    // Ajouter les événements
    
    // Clic sur la carte pour aller à la page produit
    card.addEventListener('click', (e) => {
        // Ne pas naviguer si on clique sur les boutons d'action
        if (e.target.closest('.favorite-actions')) {
            e.stopPropagation();
            return;
        }
        window.location.href = `../templates/product.html?id=${jewel.id}`;
    });
    
    // Ajouter au panier
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Simuler l'ajout au panier
        alert('Produit ajouté au panier!');
        
        // Mise à jour du compteur du panier (à implémenter plus tard)
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = parseInt(cartCount.textContent || '0') + 1;
        }
    });
    
    // Supprimer des favoris - utiliser la fonction centralisée
    const removeFavoriteBtn = card.querySelector('.remove-favorite-btn');
    removeFavoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Animation de suppression
        card.classList.add('removing');
        
        // Utiliser la fonction centralisée pour supprimer des favoris
        removeFromFavorites(jewel.id);
        
        // Attendre la fin de l'animation avant de recharger les favoris
        setTimeout(() => {
            loadFavorites();
        }, 300);
    });
    
    return card;
}
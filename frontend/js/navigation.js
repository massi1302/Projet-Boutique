// navigation.js - Script centralisé pour la gestion des redirections
document.addEventListener('DOMContentLoaded', function() {
    // Configuration des redirections pour l'en-tête (header)
    setupHeaderRedirections();
    
    // Configuration des redirections du menu latéral
    setupSidebarRedirections();
    
    // Configuration des redirections du footer
    setupFooterRedirections();
    
    // Configuration des redirections spécifiques aux pages
    setupPageSpecificRedirections();
});

// Fonction pour configurer les redirections de l'en-tête
function setupHeaderRedirections() {
    // Redirection vers la page d'accueil quand on clique sur le logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = '../templates/home.html';
        });
        logo.style.cursor = 'pointer';
    }
    
    // Redirection vers la page de profil quand on clique sur l'icône de profil
    const profileIcon = document.querySelector('.header-right img[alt="person-icon"]');
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            window.location.href = '../templates/profile.html';
        });
        profileIcon.style.cursor = 'pointer';
    }
    
    // Redirection vers la page de favoris quand on clique sur l'icône de favoris
    const favoritesIcon = document.querySelector('.header-right img[alt="favorite-icon"]');
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', function() {
            window.location.href = '../templates/favorites.html';
        });
        favoritesIcon.style.cursor = 'pointer';
    }
    
}


// Fonction pour configurer les redirections du footer
function setupFooterRedirections() {
    // Gestion des liens dans le footer
    const footerLinks = document.querySelectorAll('footer a');
    
    footerLinks.forEach(link => {
        // Si le lien n'a pas de destination ou pointe vers #, ajouter une page temporaire
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            const linkText = link.textContent.trim().toLowerCase();
            
            // Mapper le texte du lien à une page spécifique
            let destination = '';
            
            switch (linkText) {
                case 'à propos':
                case 'about':
                    destination = '../templates/about.html';
                    break;
                case 'collections':
                    destination = '../templates/collections.html';
                    break;
                case 'contact':
                    destination = '../templates/contact.html';
                    break;
                case 'livraison':
                case 'shipping':
                    destination = '../templates/shipping.html';
                    break;
                case 'retours':
                case 'returns':
                    destination = '../templates/returns.html';
                    break;
                case 'faq':
                    destination = '../templates/faq.html';
                    break;
                default:
                    destination = '../templates/home.html';
            }
            
            link.setAttribute('href', destination);
        }
    });
    
    // Gestion du formulaire d'abonnement à la newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const subscribeButton = newsletterForm.querySelector('button');
        
        if (subscribeButton) {
            subscribeButton.addEventListener('click', function(e) {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                
                if (emailInput && emailInput.value.trim() !== '') {
                    // Simuler l'abonnement (à remplacer par l'appel API réel plus tard)
                    alert('Merci de vous être abonné à notre newsletter!');
                    emailInput.value = '';
                } else {
                    alert('Veuillez entrer une adresse email valide.');
                }
            });
        }
    }
}

// Fonction pour configurer les redirections spécifiques à chaque page
function setupPageSpecificRedirections() {
    // Déterminer la page actuelle
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.includes('home.html');
    const isFavoritesPage = currentPath.includes('favorites.html');
    const isProductPage = currentPath.includes('product.html');
    
    // Redirections spécifiques à la page d'accueil
    if (isHomePage) {
        const bannerBtn = document.querySelector('.banner-btn');
        
        if (bannerBtn) {
            bannerBtn.addEventListener('click', function() {
                window.location.href = '../templates/about.html';
            });
        }
        
        // Événements pour les cartes produits dans le carousel
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Ne pas rediriger si on clique sur les favoris ou le bouton d'ajout au panier
                if (e.target.closest('.favorite-icon') || e.target.closest('.add-to-cart')) {
                    return;
                }
                
                // Trouver l'ID du produit
                const jewelId = this.closest('.swiper-slide').dataset.jewelId;
                
                if (jewelId) {
                    window.location.href = `../templates/product.html?id=${jewelId}`;
                }
            });
        });
    }
    
    // Redirections spécifiques à la page de favoris
    if (isFavoritesPage) {
        // Géré par favorites.js - Pas de code supplémentaire nécessaire
    }
    
    // Redirections spécifiques à la page produit
    if (isProductPage) {
        // Gestion du bouton "Ajouter au panier"
        const addToCartBtn = document.getElementById('add-to-cart');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productId = new URLSearchParams(window.location.search).get('id');
                const quantity = parseInt(document.getElementById('quantity-input').value, 10) || 1;
                
                // Ajouter au panier (fonction à implémenter dans shoppingCart.js)
                if (window.addToCart) {
                    window.addToCart(productId, quantity);
                } else {
                    // Fallback si la fonction n'est pas disponible
                    alert('Produit ajouté au panier!');
                }
            });
        }
        
        // Gestion du bouton "Ajouter aux favoris"
        const addToWishlistBtn = document.getElementById('add-to-wishlist');
        
        if (addToWishlistBtn) {
            addToWishlistBtn.addEventListener('click', function() {
                const productId = new URLSearchParams(window.location.search).get('id');
                
                // Utiliser la fonction centralisée pour basculer l'état des favoris
                const isNowFavorite = window.toggleFavorite(productId);
                
                // Mettre à jour l'interface en fonction du nouvel état
                const wishlistIcon = this.querySelector('img');
                
                if (isNowFavorite) {
                    wishlistIcon.src = '../icons/favorite.png';
                    this.classList.add('active');
                } else {
                    wishlistIcon.src = '../icons/favorite_border.png';
                    this.classList.remove('active');
                }
            });
        }
        
        // Gestion des produits similaires
        document.querySelectorAll('.similar-product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Ne pas rediriger si on clique sur le bouton d'ajout au panier
                if (e.target.closest('.similar-product-actions')) {
                    e.stopPropagation();
                    return;
                }
                
                // Extraire l'ID du produit (à implémenter dans le HTML)
                const productId = this.dataset.productId;
                
                if (productId) {
                    window.location.href = `../templates/product.html?id=${productId}`;
                }
            });
        });
    }
    
    // Configuration de la navigation du fil d'Ariane (breadcrumb)
    setupBreadcrumbNavigation();
}

// Fonction pour configurer la navigation du fil d'Ariane
function setupBreadcrumbNavigation() {
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    
    breadcrumbLinks.forEach(link => {
        // S'assurer que tous les liens du fil d'Ariane ont un href valide
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            const linkText = link.textContent.trim().toLowerCase();
            
            if (linkText === 'accueil' || linkText === 'home') {
                link.setAttribute('href', '../templates/home.html');
            } else {
                // Pour les autres liens, utiliser le texte comme nom de fichier
                link.setAttribute('href', `../templates/${linkText}.html`);
            }
        }
        
        // Ajouter un style de pointeur pour montrer qu'il s'agit d'un lien cliquable
        link.style.cursor = 'pointer';
    });
}


// URL de l'API - définition centralisée
const API_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function () {
    // Mise à jour du compteur de favoris au chargement
    updateFavoritesCounter();

    // Gestion du header transparent qui devient opaque au défilement
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
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
        logo.addEventListener('click', function () {
            window.location.href = '../templates/home.html';
        });
        logo.style.cursor = 'pointer';
    }

    // Navigation vers la page de profil quand on clique sur l'icône de profil
    const profileIcon = document.querySelector('.header-right img[alt="person-icon"]');
    if (profileIcon) {
        profileIcon.addEventListener('click', function () {
            window.location.href = '../templates/profile.html';
        });
    }

    // Navigation vers la page de favoris quand on clique sur l'icône de favoris
    const favoritesIcon = document.querySelector('.header-right img[alt="favorite-icon"]');
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', function () {
            window.location.href = '../templates/favorites.html';
        });
    }

    // Ajouter un effet de survol pour les icônes du header
    const headerIcons = document.querySelectorAll('.header-right img, .header-left img');
    headerIcons.forEach(icon => {
        icon.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });

        icon.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Animation au défilement
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement

    // Ajouter une classe active pour le menu
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer) {
        menuContainer.addEventListener('click', function () {
            this.classList.toggle('active');
            // Ici, vous pourriez ajouter code pour afficher un menu mobile
        });
    }
    
    // Gestion des sous-menus dans la sidebar
    setupExpandableMenu();
});

// Configuration des menus déroulants dans la sidebar
function setupExpandableMenu() {
    // Sélectionner tous les éléments du menu qui ont des sous-catégories
    const menuItems = document.querySelectorAll('.has-submenu');
    
    menuItems.forEach(item => {
        // Ajouter l'écouteur d'événement sur le lien parent
        const menuLink = item.querySelector('.menu-link');
        
        menuLink.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher la navigation par défaut
            
            // Trouver le sous-menu associé
            const submenu = item.querySelector('.submenu');
            
            // Vérifier si le sous-menu est déjà ouvert
            const isOpen = submenu.classList.contains('active');
            
            // Fermer tous les sous-menus ouverts
            document.querySelectorAll('.submenu.active').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('active');
                    menu.style.maxHeight = '0';
                }
            });
            
            // Basculer l'état du sous-menu actuel
            if (isOpen) {
                submenu.classList.remove('active');
                submenu.style.maxHeight = '0';
            } else {
                submenu.classList.add('active');
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
        
        // Ajouter des écouteurs d'événements pour les sous-éléments
        const submenuItems = item.querySelectorAll('.submenu-item');
        submenuItems.forEach(subItem => {
            subItem.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher la propagation aux parents
                
                // Récupérer la catégorie et le genre depuis les attributs data
                const category = this.closest('.has-submenu').dataset.category;
                const gender = this.dataset.gender;
                
                // Rediriger vers la page correspondante
                window.location.href = `../templates/category.html?type=${category}&gender=${gender}`;
            });
        });
    });
}

// Gestion de la barre latérale
const menu = document.querySelector('#menu-button');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('#closeBtn');

if (menu) {
    menu.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && menu && !menu.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// --------- GESTION DES FAVORIS - SYSTÈME CENTRALISÉ ---------

/**
 * Vérifie si un produit est dans les favoris
 * @param {number|string} productId - ID du produit à vérifier
 * @returns {boolean} - True si le produit est déjà dans les favoris
 */
function isInFavorites(productId) {
    // Normaliser l'ID en nombre
    const productIdNum = parseInt(productId, 10);
    
    // Récupérer les favoris depuis le localStorage
    const favorites = getFavoritesFromStorage();
    
    // Vérifier si le produit est déjà dans les favoris
    return favorites.some(id => parseInt(id, 10) === productIdNum);
}

/**
 * Récupère la liste des favoris depuis le localStorage
 * @returns {number[]} - Liste des IDs des produits favoris (normalisés en nombres)
 */
function getFavoritesFromStorage() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // S'assurer que tous les IDs sont des nombres
    return favorites.map(id => parseInt(id, 10));
}

/**
 * Sauvegarde la liste des favoris dans le localStorage
 * @param {number[]} favorites - Liste des IDs des produits favoris
 */
function saveFavoritesToStorage(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * Ajoute un produit aux favoris
 * @param {number|string} productId - ID du produit à ajouter
 * @returns {boolean} - True si l'opération a réussi
 */
function addToFavorites(productId) {
    // Normaliser l'ID en nombre
    const productIdNum = parseInt(productId, 10);
    
    // Récupérer les favoris actuels
    const favorites = getFavoritesFromStorage();
    
    // Vérifier si l'ID est déjà présent
    if (!favorites.includes(productIdNum)) {
        favorites.push(productIdNum);
        saveFavoritesToStorage(favorites);
    }
    
    // Mettre à jour l'affichage du compteur
    updateFavoritesCounter();
    return true;
}

/**
 * Retire un produit des favoris
 * @param {number|string} productId - ID du produit à retirer
 * @returns {boolean} - True si l'opération a réussi
 */
function removeFromFavorites(productId) {
    // Normaliser l'ID en nombre
    const productIdNum = parseInt(productId, 10);
    
    // Récupérer les favoris actuels
    let favorites = getFavoritesFromStorage();
    
    // Filtrer pour retirer l'ID
    favorites = favorites.filter(id => id !== productIdNum);
    
    // Sauvegarder la liste mise à jour
    saveFavoritesToStorage(favorites);
    
    // Mettre à jour l'affichage du compteur
    updateFavoritesCounter();
    return true;
}

/**
 * Bascule l'état d'un produit dans les favoris
 * @param {number|string} productId - ID du produit à basculer
 * @returns {boolean} - True si le produit est maintenant dans les favoris, False sinon
 */
function toggleFavorite(productId) {
    // Vérifier si le produit est déjà dans les favoris
    if (isInFavorites(productId)) {
        removeFromFavorites(productId);
        return false;
    } else {
        addToFavorites(productId);
        return true;
    }
}

/**
 * Met à jour l'affichage du compteur de favoris dans l'interface
 */
function updateFavoritesCounter() {
    const favorites = getFavoritesFromStorage();
    const counter = document.getElementById('favorites-count');
    
    if (counter) {
        counter.textContent = favorites.length;
        
        // Masquer le compteur s'il est à zéro
        if (favorites.length === 0) {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'inline-block';
        }
    }
}

// Exposer les fonctions de gestion des favoris à la portée globale
window.isInFavorites = isInFavorites;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.toggleFavorite = toggleFavorite;
window.updateFavoritesCounter = updateFavoritesCounter;
window.API_URL = API_URL;
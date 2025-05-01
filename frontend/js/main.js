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

    // Setup search functionality
    setupSearch();

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
            window.location.href = `../templates/home.html`;
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
        });
    }

    // Gestion des sous-menus dans la sidebar
    setupExpandableMenu();
});

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search__input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.search').appendChild(searchResults);

    let debounceTimer;

    searchInput.addEventListener('input', function (e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSearchResults(query, searchResults);
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search')) {
            searchResults.style.display = 'none';
        }
    });
}

async function fetchSearchResults(query, resultsContainer) {
    try {
        const response = await fetch(`${API_URL}/jewelry`);
        const data = await response.json();

        const results = data.jewelry.filter(item => {
            const searchString = `${item.name} ${item.description} ${item.characteristics.type}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        }).slice(0, 5); // Limit to 5 results

        displaySearchResults(results, resultsContainer);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="window.location.href='../templates/product.html?id=${item.id}'">
            <img src="${API_URL}${item.images[0]}" alt="${item.name}">
            <div class="search-result-info">
                <h4>${item.name}</h4>
                <p>${item.price}${item.currency}</p>
            </div>
        </div>
    `).join('');

    container.style.display = 'block';
}

// Configuration des menus déroulants dans la sidebar
function setupExpandableMenu() {
    // Sélectionner tous les éléments du menu qui ont des sous-catégories
    const menuItems = document.querySelectorAll('.has-submenu');

    menuItems.forEach(item => {
        // Ajouter l'écouteur d'événement sur le lien parent
        const menuLink = item.querySelector('.menu-link');

        menuLink.addEventListener('click', function (e) {
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
            subItem.addEventListener('click', function (e) {
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

function isInFavorites(productId) {
    const productIdNum = parseInt(productId, 10);
    const favorites = getFavoritesFromStorage();
    return favorites.some(id => parseInt(id, 10) === productIdNum);
}

function getFavoritesFromStorage() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.map(id => parseInt(id, 10));
}

function saveFavoritesToStorage(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function addToFavorites(productId) {
    const productIdNum = parseInt(productId, 10);
    const favorites = getFavoritesFromStorage();

    if (!favorites.includes(productIdNum)) {
        favorites.push(productIdNum);
        saveFavoritesToStorage(favorites);
    }

    updateFavoritesCounter();
    return true;
}

function removeFromFavorites(productId) {
    const productIdNum = parseInt(productId, 10);
    let favorites = getFavoritesFromStorage();
    favorites = favorites.filter(id => id !== productIdNum);
    saveFavoritesToStorage(favorites);
    updateFavoritesCounter();
    return true;
}

function toggleFavorite(productId) {
    if (isInFavorites(productId)) {
        removeFromFavorites(productId);
        return false;
    } else {
        addToFavorites(productId);
        return true;
    }
}

function updateFavoritesCounter() {
    const favorites = getFavoritesFromStorage();
    const counter = document.getElementById('favorites-count');

    if (counter) {
        counter.textContent = favorites.length;
        counter.style.display = favorites.length === 0 ? 'none' : 'inline-block';
    }
}

window.isInFavorites = isInFavorites;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.toggleFavorite = toggleFavorite;
window.updateFavoritesCounter = updateFavoritesCounter;
window.API_URL = API_URL;
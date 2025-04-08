// URL de base de l'API
const API_URL = 'http://localhost:3000/auth';

// Fonctions utilitaires pour la gestion des tokens et utilisateurs
const AuthUtils = {
    // Sauvegarde du token dans le localStorage
    saveToken: (token) => {
        localStorage.setItem('authToken', token);
    },
    
    // Récupération du token
    getToken: () => {
        return localStorage.getItem('authToken');
    },
    
    // Sauvegarde des données utilisateur
    saveUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Récupération des données utilisateur
    getUser: () => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Suppression des données d'authentification
    clearAuth: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
    
    // Vérification si l'utilisateur est connecté
    isAuthenticated: () => {
        return !!AuthUtils.getToken();
    },
    
    // Redirection vers la page appropriée
    redirectToProfile: () => {
        window.location.href = '/templates/user-profil.html';
    },
    
    // Redirection vers la page de connexion
    redirectToLogin: () => {
        window.location.href = '/templates/profile.html';
    }
};

// Affichage des messages d'alerte
function showAlert(message, type = 'error') {
    // Supprimer les alertes existantes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Créer une nouvelle alerte
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerText = message;
    
    // Insérer l'alerte avant le formulaire actif
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        activeForm.insertBefore(alertDiv, activeForm.firstChild);
        
        // Faire disparaître l'alerte après 5 secondes
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 5000);
    }
}

// Validation du formulaire d'inscription
function validateRegisterForm() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    if (password.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères');
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert('Les mots de passe ne correspondent pas');
        return false;
    }
    
    if (!terms) {
        showAlert('Vous devez accepter les conditions générales');
        return false;
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script d\'authentification chargé');
    
    // Vérifier si l'utilisateur est déjà connecté sur la page de profil
    const isProfilePage = window.location.pathname.includes('profile.html');
    const isUserProfilePage = window.location.pathname.includes('user-profil.html');
    
    if (isProfilePage && AuthUtils.isAuthenticated()) {
        // Rediriger vers la page de profil utilisateur si déjà connecté
        AuthUtils.redirectToProfile();
        return;
    }
    
    if (isUserProfilePage && !AuthUtils.isAuthenticated()) {
        // Rediriger vers la page de connexion si non connecté
        AuthUtils.redirectToLogin();
        return;
    }
    
    // Charger les données utilisateur sur la page profil
    if (isUserProfilePage) {
        loadUserProfile();
    }
    
    // Récupérer les éléments des onglets et formulaires
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Vérifier si les éléments existent et afficher dans la console
    console.log('Éléments trouvés:', {
        loginTab: loginTab ? true : false,
        registerTab: registerTab ? true : false,
        loginForm: loginForm ? true : false,
        registerForm: registerForm ? true : false
    });
    
    // Fonction simplifiée pour changer d'onglet
    function switchTab(isLoginActive) {
        console.log('Changement d\'onglet vers:', isLoginActive ? 'connexion' : 'inscription');
        
        // Mettre à jour les classes des onglets
        if (loginTab && registerTab) {
            loginTab.classList.toggle('active', isLoginActive);
            registerTab.classList.toggle('active', !isLoginActive);
        }
        
        // Mettre à jour les classes des formulaires
        if (loginForm && registerForm) {
            loginForm.classList.toggle('active', isLoginActive);
            registerForm.classList.toggle('active', !isLoginActive);
        }
    }
    
    // Ajouter les écouteurs d'événements pour les onglets
    if (loginTab) {
        loginTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Onglet connexion cliqué');
            switchTab(true);
        });
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Onglet inscription cliqué');
            switchTab(false);
        });
    }
    
    // Pour le formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulaire de connexion soumis');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de la connexion');
                }
                
                // Sauvegarder les données d'authentification
                AuthUtils.saveToken(data.token);
                AuthUtils.saveUser(data.user);
                
                // Rediriger vers la page de profil
                AuthUtils.redirectToProfile();
                
            } catch (error) {
                console.error('Erreur de connexion:', error);
                showAlert(error.message || 'Erreur lors de la connexion');
            }
        });
    }
    
    // Pour le formulaire d'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulaire d\'inscription soumis');
            
            // Valider le formulaire
            if (!validateRegisterForm()) {
                return;
            }
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de l\'inscription');
                }
                
                // Sauvegarder les données d'authentification
                AuthUtils.saveToken(data.token);
                AuthUtils.saveUser(data.user);
                
                // Afficher un message de succès
                showAlert('Compte créé avec succès! Redirection...', 'success');
                
                // Rediriger vers la page de profil après un court délai
                setTimeout(() => {
                    AuthUtils.redirectToProfile();
                }, 1500);
                
            } catch (error) {
                console.error('Erreur d\'inscription:', error);
                showAlert(error.message || 'Erreur lors de l\'inscription');
            }
        });
    }
    
    // Bouton de déconnexion sur la page profil
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            AuthUtils.clearAuth();
            AuthUtils.redirectToLogin();
        });
    }
});

// Fonction pour charger les informations du profil utilisateur
function loadUserProfile() {
    const user = AuthUtils.getUser();
    if (!user) return;
    
    // Mettre à jour les informations affichées
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    
    if (profileNameElement) {
        profileNameElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    if (profileEmailElement) {
        profileEmailElement.textContent = user.email;
    }
    
    // Si on a besoin de données supplémentaires depuis l'API
    fetchUserDetails();
}

// Fonction pour récupérer des détails supplémentaires sur l'utilisateur si nécessaire
async function fetchUserDetails() {
    try {
        const token = AuthUtils.getToken();
        if (!token) return;
        
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // Si le token est invalide ou expiré, déconnecter l'utilisateur
            if (response.status === 401 || response.status === 403) {
                AuthUtils.clearAuth();
                AuthUtils.redirectToLogin();
                return;
            }
            throw new Error('Erreur lors de la récupération des données utilisateur');
        }
        
        const data = await response.json();
        
        // Mettre à jour les informations supplémentaires si nécessaire
        // Par exemple, historique des commandes, adresses, etc.
        
    } catch (error) {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
    }
}
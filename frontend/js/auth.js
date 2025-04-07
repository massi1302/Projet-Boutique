document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // URL de base pour les API
    const apiUrl = 'http://localhost:3000/auth';
    
    // Fonction pour changer d'onglet
    function switchTab(activeTab) {
        // Mettre à jour les classes des onglets
        loginTab.classList.remove('active');
        registerTab.classList.remove('active');
        activeTab.classList.add('active');
        
        // Afficher le formulaire correspondant
        if (activeTab === loginTab) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }
    
    // Écouteurs d'événements pour les onglets
    if (loginTab) {
        loginTab.addEventListener('click', function() {
            switchTab(loginTab);
        });
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', function() {
            switchTab(registerTab);
        });
    }
    
    // Gestion du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validation basique côté client
            if (!email || !password) {
                showAlert('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Envoyer les données au serveur
            fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Stocker le token dans localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Afficher un message de succès et rediriger
                    showAlert('Connexion réussie, redirection en cours...', 'success');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    // Afficher un message d'erreur
                    showAlert(data.message, 'error', loginForm);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                showAlert('Une erreur est survenue, veuillez réessayer', 'error', loginForm);
            });
        });
    }
    
    // Gestion du formulaire d'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validation basique côté client
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showAlert('Veuillez remplir tous les champs', 'error', registerForm);
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Les mots de passe ne correspondent pas', 'error', registerForm);
                return;
            }
            
            if (password.length < 6) {
                showAlert('Le mot de passe doit contenir au moins 6 caractères', 'error', registerForm);
                return;
            }
            
            if (!termsAccepted) {
                showAlert('Vous devez accepter les conditions générales', 'error', registerForm);
                return;
            }
            
            // Envoyer les données au serveur
            fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Stocker le token dans localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Afficher un message de succès et rediriger
                    showAlert('Inscription réussie, redirection en cours...', 'success', registerForm);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    // Afficher un message d'erreur
                    showAlert(data.message, 'error', registerForm);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                showAlert('Une erreur est survenue, veuillez réessayer', 'error', registerForm);
            });
        });
    }
    
    // Fonction pour afficher des alertes
    function showAlert(message, type, form) {
        // Déterminer quel formulaire est actif si aucun n'est spécifié
        if (!form) {
            form = loginForm && loginForm.classList.contains('active') ? loginForm : registerForm;
        }
        
        if (!form) return; // Si aucun formulaire n'est disponible
        
        // Vérifier si une alerte existe déjà dans ce formulaire et la supprimer
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Créer une nouvelle alerte
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Ajouter l'alerte au formulaire
        form.insertBefore(alertDiv, form.firstChild);
        
        // Supprimer l'alerte après 3 secondes
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    // Fonction pour vérifier si l'utilisateur est connecté
    function checkAuth() {
        const token = localStorage.getItem('token');
        
        if (token && window.location.pathname.includes('profile.html')) {
            // L'utilisateur est connecté et sur la page de profil
            // Ici vous pourriez charger les informations du profil
        }
    }
    
    // Vérifier l'état de connexion au chargement de la page
    checkAuth();
});
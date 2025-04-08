const authMiddleware = require('../middleware/auth');

const users = [];

exports.register = (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Validation basique
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Tous les champs sont requis'
            });
        }
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Cet email est déjà utilisé'
            });
        }
        
        // Dans un environnement de production, hashage du mot de passe avec bcrypt
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        // Créer le nouvel utilisateur
        const newUser = {
            id: users.length + 1,
            firstName,
            lastName,
            email,
            password, // En production: hashedPassword
            createdAt: new Date()
        };
        
        // Ajouter l'utilisateur 
        users.push(newUser);
        
        // Générer un token JWT
        const token = authMiddleware.generateToken({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        });
        
        // Réponse réussie
        res.status(201).json({
            status: 'success',
            message: 'Compte créé avec succès',
            token,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur serveur lors de l\'inscription'
        });
    }
};

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation basique
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email et mot de passe requis'
            });
        }
        
        // Rechercher l'utilisateur
        const user = users.find(user => user.email === email);
        
        // Si l'utilisateur n'existe pas ou le mot de passe est incorrect
        if (!user || user.password !== password) { 
            // En production: await bcrypt.compare(password, user.password)
            return res.status(401).json({
                status: 'error',
                message: 'Email ou mot de passe incorrect'
            });
        }
        
        // Générer un token JWT
        const token = authMiddleware.generateToken({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
        
        // Réponse réussie
        res.status(200).json({
            status: 'success',
            message: 'Connexion réussie',
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur serveur lors de la connexion'
        });
    }
};

// Pour tester si l'API est accessible
exports.getMe = (req, res) => {
    // req.user est défini par le middleware verifyToken
    res.status(200).json({
        status: 'success',
        user: req.user
    });
};
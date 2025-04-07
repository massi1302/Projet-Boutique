const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/img', express.static(path.join(__dirname, '/img')));
// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware CORS
app.use(cors({
    origin: "*"
}));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/luce_preziosa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
const jewelriesRouter = require("./routes/routes");
const authRouter = require("./routes/auth");

app.use(jewelriesRouter);
app.use('/auth', authRouter);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile('home.html', { root: path.join(__dirname, '../frontend/templates') });
});



// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
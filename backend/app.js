const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Middleware pour les fichiers statiques
const path = require('path');
app.use('/img', express.static(path.join(__dirname, '/img')));

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware CORS
app.use(cors({
    origin: "*"
}));

// Routes
const jewelriesRouter = require("./routes/routes");
const authRouter = require("./routes/auth");

app.use(jewelriesRouter);
app.use('/auth', authRouter);


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
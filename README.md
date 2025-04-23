# Luce Preziosa - Site de Bijouterie

Ce projet est un site web de vente de bijoux avec une architecture séparée pour le frontend et le backend.

## Structure du projet

Le projet est divisé en deux parties principales :
- **Frontend** : Interface utilisateur en HTML, CSS et JavaScript
- **Backend** : API REST développée avec Express.js

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd luce-preziosa
```

### 2. Configurer le Backend

Naviguez dans le répertoire du backend :

```bash
cd backend
```

Installez les dépendances :

```bash
npm install
```

Assurez-vous que le fichier `products.json` est présent à la racine du dossier backend.

### 3. Configurer le Frontend

Dans un autre terminal, naviguez vers le répertoire du frontend :

```bash
cd frontend
```

## Démarrage des services

### 1. Démarrer le backend

Dans le dossier backend :

```bash
npm start
```

Le serveur backend devrait démarrer sur http://localhost:5000

### 2. Servir le frontend

Vous pouvez utiliser n'importe quel serveur HTTP local pour servir les fichiers frontend.

Par exemple, avec l'extension Live Server de VS Code :
- Ouvrez le dossier frontend dans VS Code
- Cliquez-droit sur le fichier `templates/home.html`
- Sélectionnez "Open with Live Server"

Ou avec un serveur HTTP simple comme `serve` :

```bash
npx serve
```

Le frontend sera accessible à l'adresse fournie par votre serveur local.


## Notes

- Assurez-vous que le backend est en cours d'exécution avant d'accéder au frontend
- Le système d'authentification utilise JWT stocké dans le localStorage
- Les données utilisateur sont temporairement stockées en mémoire (pas de persistance après redémarrage du serveur)
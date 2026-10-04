# YouTube Clone

Une application web qui reproduit l'interface de YouTube, développée avec React et Vite.
Elle permet de parcourir les vidéos tendance, rechercher des contenus, consulter des chaînes et lire des vidéos.

## Fonctionnalités

- Page d'accueil avec flux de vidéos par catégorie
- Recherche de vidéos
- Lecteur vidéo intégré
- Pages de chaînes dédiées
- Interface responsive (mobile / desktop) avec barre de navigation inférieure sur mobile
- Persistance de la catégorie sélectionnée et cache des requêtes (React Query)

## Technologies utilisées

- **React 19** avec **Vite**
- **React Router** pour la navigation
- **Material UI (MUI)** pour les composants et le style
- **TanStack Query** (+ persistance) pour la gestion des données
- **Axios** pour les appels API
- **React Player** pour la lecture vidéo
- API YouTube : RapidAPI YouTube v3.1 ou API officielle Google YouTube Data v3

## Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- Une clé API (RapidAPI YouTube v3.1 ou API YouTube Data v3)

## Installation

```bash
# Cloner le projet
git clone https://github.com/NoobTods/Youtube-clone
cd Youtube_clone

# Installer les dépendances
npm install
```

## Configuration

Crée un fichier `.env` à la racine du projet :

```env
# Choisis le provider : "rapidapi" ou "official"
VITE_API_PROVIDER='official'

# Clé RapidAPI (si VITE_API_PROVIDER='rapidapi')
VITE_APP_RAPID_API_KEY='ta_cle_rapidapi'

# Clé API YouTube officielle (si VITE_API_PROVIDER='official')
VITE_YOUTUBE_API_KEY='ta_cle_google'
```

## Lancer le projet

```bash
# Mode développement
npm run dev

# Linter
npm run lint

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Structure du projet

```
src/
├── components/      # Composants React (Feed, VideoCard, Sidebar, Navbar...)
├── utils/           # Fonctions utilitaires (fetchFromAPI, constantes)
├── App.jsx          # Composant racine + routes
└── main.jsx         # Point d'entrée
```

## Auteur

Projet réalisé par **NoobTods** — [GitHub](https://github.com/NoobTods)

## Licence

Ce projet est destiné à un usage éducatif.

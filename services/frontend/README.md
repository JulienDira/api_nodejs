## Installation
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

## Dépendances
```bash
npm install axios jwt-decode
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📁 Arborescence et explications
```bash
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── PostsPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── postService.js
│   │   └── likeService.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .eslintrc.js (ou eslint.config.js)
├── package.json
└── README.md
```

## 🗂️ Détail des dossiers et fichiers
### 📁 public/
-   Contient les fichiers statiques accessibles tels quels (favicon, images, etc.).
-   Vite copie tout le contenu de public/ dans le dossier final (dist/) tel quel.
-   Exemple : /public/logo.png sera accessible via http://localhost:3000/logo.png.

### 📁 src/
-   Le cœur de l'application React.

### 📁 src/pages/
-   LoginPage.jsx : formulaire de connexion et inscription.
-   PostsPage.jsx : interface principale après authentification (affichage des posts, création, likes...).

### 📁 src/services/
-   Contient les fonctions utilitaires pour les appels API.
-   authService.js : login / register
-   postService.js : récupérer / créer / supprimer des posts
-   likeService.js : liker / unliker un post

### 📄 App.jsx
Composant principal qui gère :
-   L'état global (utilisateur connecté, formulaire, etc.)
-   Le switch entre LoginPage et PostsPage

### 📄 main.jsx
-   Point d’entrée de React (équivalent à index.js dans CRA).
-   Monte le composant <App /> dans le DOM.

## 📄 Fichiers racines
### 🧾 index.html
-   Fichier HTML principal utilisé par Vite.
-   Contient la balise <div id="root"></div> dans laquelle l’app React sera montée.

### ⚙️ vite.config.js
-   Configuration de Vite.

### 🎨 tailwind.config.js
-   Fichier de configuration de Tailwind CSS.
-   Permet d’ajouter des couleurs, breakpoints, plugins, etc.

### 🔧 postcss.config.js
-   Utilisé par Tailwind + PostCSS pour transformer le CSS moderne.

### 📏 .eslintrc.js (ou eslint.config.js)
-   Configuration du linter ESLint.
-   Permet de garder un code propre et cohérent.

### 📦 package.json
-   Liste les dépendances, scripts, infos du projet.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

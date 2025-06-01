# Guide complet : Styling et CSS dans React + Vite

## 🏗️ Architecture d'un projet React + Vite

```
mon-projet/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx          ← Point d'entrée
│   ├── index.css         ← CSS global principal
│   └── App.css           ← CSS spécifique à App.jsx
├── index.html            ← Template HTML
├── package.json
├── vite.config.js        ← Configuration Vite
├── tailwind.config.js    ← Configuration Tailwind
└── postcss.config.js     ← Configuration PostCSS
```

---

## 📁 Rôle de chaque fichier CSS

### **1. `index.css` - Le CSS global principal**

**Rôle :** Styles globaux appliqués à toute l'application

```css
/* Styles de base pour toute l'app */
@tailwind base;      ← Styles de base de Tailwind
@tailwind components; ← Composants prédéfinis
@tailwind utilities;  ← Classes utilitaires

/* Variables CSS globales */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
}

/* Styles globaux */
body {
  margin: 0;
  font-family: system-ui, Arial, sans-serif;
}

/* Vos classes personnalisées */
.my-custom-class {
  /* ... */
}
```

**Importé dans :** `main.jsx`
```jsx
import './index.css'  // ← CSS global chargé ici
```

### **2. `App.css` - CSS spécifique au composant App**

**Rôle :** Styles spécifiques au composant racine App.jsx

```css
/* Styles uniquement pour App.jsx */
.App {
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
}
```

**Importé dans :** `App.jsx`
```jsx
import './App.css'  // ← CSS spécifique à App
```

---

## ⚙️ Configuration des outils

### **1. `tailwind.config.js` - Configuration Tailwind CSS**

**Rôle :** Personnalise Tailwind selon vos besoins

```javascript
export default {
  // 🎯 CONTENT : Où chercher les classes Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"  // Tous les fichiers JS/TS
  ],
  
  // 🎨 THEME : Personnalisation du design system
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1fb6ff',
        'brand-purple': '#7e5bef',
      },
      fontFamily: {
        'custom': ['Inter', 'sans-serif'],
      }
    },
  },
  
  // 🌙 DARKMODE : Mode sombre
  darkMode: 'class', // ou 'media'
  
  // 🔌 PLUGINS : Extensions
  plugins: [],
}
```

**Pourquoi important :**
- Tailwind scanne vos fichiers pour ne garder que les classes utilisées
- Permet de personnaliser les couleurs, fonts, espacements...
- Optimise la taille du CSS final

### **2. `postcss.config.js` - Configuration PostCSS**

**Rôle :** Traite le CSS avant qu'il soit servi au navigateur

```javascript
export default {
  plugins: {
    tailwindcss: {},    // ← Traite Tailwind
    autoprefixer: {},   // ← Ajoute les préfixes navigateurs
  },
}
```

**Que fait PostCSS :**
```css
/* Votre CSS */
.example {
  display: flex;
}

/* Après PostCSS */
.example {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

---

## 🔄 Comment ça fonctionne ensemble

### **1. Chaîne de traitement CSS**

```
1. Vous écrivez du CSS + Tailwind
2. Vite détecte les changements
3. PostCSS traite le CSS (Tailwind + Autoprefixer)
4. CSS optimisé envoyé au navigateur
```

### **2. Ordre de priorité CSS**

```
1. Styles inline (style="...")        ← Plus haute priorité
2. CSS Modules / Styled Components
3. Classes CSS personnalisées
4. Classes Tailwind                   ← Plus basse priorité
```

---

## 🎨 Stratégies de styling

### **Approche 1 : Tailwind pur (Recommandé)**

```jsx
// Utilisation exclusive de Tailwind
function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Cliquez-moi
    </button>
  );
}
```

**Avantages :**
- Cohérence du design
- Pas de CSS personnalisé à maintenir
- Purge automatique du CSS non utilisé

### **Approche 2 : Tailwind + CSS personnalisé**

```jsx
// Tailwind + classes personnalisées
function Card() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 my-custom-card">
      <h2 className="text-xl font-bold">Titre</h2>
    </div>
  );
}
```

```css
/* Dans votre CSS */
@layer components {
  .my-custom-card {
    background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  }
}
```

### **Approche 3 : CSS Modules**

```jsx
// Button.module.css
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Cliquez-moi</button>;
}
```

---

## 📂 Organisation recommandée

### **Structure de fichiers CSS**

```
src/
├── styles/
│   ├── globals.css       ← Styles globaux + Tailwind
│   ├── components.css    ← Composants réutilisables
│   └── utilities.css     ← Classes utilitaires
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css  ← CSS spécifique au composant
│   └── Card/
│       ├── Card.jsx
│       └── Card.css
```

### **Organisation du CSS global**

```css
/* globals.css */

/* 1. Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. Variables CSS */
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
}

/* 3. Styles de base */
html, body {
  margin: 0;
  padding: 0;
}

/* 4. Composants réutilisables */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}

/* 5. Utilitaires personnalisés */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
}
```

---

## 🚀 Configuration optimale pour un nouveau projet

### **1. Installation**

```bash
# Création du projet
npm create vite@latest mon-projet -- --template react
cd mon-projet

# Installation de Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **2. Configuration des fichiers**

**`tailwind.config.js`**
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
```

**`src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables globales */
:root {
  --primary: theme('colors.primary');
}

/* Styles de base */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

**`src/main.jsx`**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // ← CSS global importé ici

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 🎯 Bonnes pratiques

### **1. Où mettre quoi**

| Type de style | Où le mettre | Exemple |
|---------------|--------------|---------|
| Styles globaux | `index.css` | Reset CSS, variables |
| Composants réutilisables | `@layer components` | Boutons, cards |
| Styles spécifiques | CSS Modules | Composant unique |
| Utilitaires | `@layer utilities` | Classes helper |

### **2. Optimisation**

```css
/* ✅ Bon : Utilise @layer pour l'ordre de priorité */
@layer components {
  .btn {
    @apply px-4 py-2 rounded;
  }
}

/* ❌ Éviter : CSS en vrac sans organisation */
.btn {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
}
```

### **3. Performance**

- Tailwind purge automatiquement le CSS non utilisé
- Utilisez `@apply` pour éviter la répétition
- Préférez les classes Tailwind aux CSS personnalisés

---

## 🔧 Debugging

### **Tailwind ne fonctionne pas ?**

1. **Vérifiez `postcss.config.js`** existe
2. **Vérifiez `tailwind.config.js`** a les bons chemins
3. **Vérifiez `index.css`** a les directives @tailwind
4. **Redémarrez le serveur** après changement de config

### **CSS ne s'applique pas ?**

1. Vérifiez l'ordre de priorité CSS
2. Utilisez les DevTools pour voir quels styles sont appliqués
3. Vérifiez que le CSS est bien importé

---

## 💡 Résumé

- **`index.css`** : CSS global de l'app
- **`App.css`** : CSS spécifique au composant App
- **`tailwind.config.js`** : Configuration et personnalisation de Tailwind
- **`postcss.config.js`** : Traitement du CSS (obligatoire pour Tailwind)
- **Vite** : Bundler qui orchestre tout ça

**La règle d'or :** Utilisez Tailwind pour 90% de vos styles, CSS personnalisé pour les 10% restants !

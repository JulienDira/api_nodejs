// tailwind.config.js
export default {
  // Active Tailwind sur tous tes fichiers sources
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Thème personnalisé
  theme: {
    extend: {
      colors: {
        // Couleur de fond semi-transparente pour l'effet glassmorphism
        "glass-dark": "rgba(255, 255, 255, 0.05)",
      },
      boxShadow: {
        // Ombre interne pour les inputs gravés dans le fond
        "inner-glass":
          "inset 4px 4px 10px rgba(0,0,0,0.4), inset -4px -4px 10px rgba(255,255,255,0.05)",
      },
    },
  },

  // Active le mode sombre basé sur une classe .dark (à gérer côté React)
  darkMode: "class",

  // Plugins éventuels à ajouter plus tard (forms, typography…)
  plugins: [],
};

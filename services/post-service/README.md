# 🧩 Microservice 2 : Post-Service (Commentaires)  

## ➕ Fonctionnalités
-   Inscription sécurisée (bcrypt)
-   Connexion avec token (JWT recommandé)
-   Récupération de mot de passe (lien / OTP simplifié)
-   Validation des champs
-   Stockage MongoDB

## 📁 Structure interne du service
```bash
/post-service
├── src/
│   ├── controllers/
│   │   └── post.controller.js
│   ├── models/
│   │   └── post.model.js
│   ├── routes/
│   │   └── post.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```
## 📦 Installation

```bash
cd services/post-service
npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon
```

## 🧪 Tests manuels  
  
Utiliser Postman avec les routes suivantes :  
-   POST /api/users/register
-   POST /api/users/login
-   POST /api/users/forgot-password
# 🧩 Microservice 1 : Like-Service (Utilisateurs)  

## ➕ Fonctionnalités
-   Inscription sécurisée (bcrypt)
-   Connexion avec token (JWT recommandé)
-   Récupération de mot de passe (lien / OTP simplifié)
-   Validation des champs
-   Stockage MongoDB

## 📁 Structure interne du service
```bash
/like-service
├── src/
│   ├── controllers/
│   │   └── like.controller.js
│   ├── models/
│   │   └── like.model.js
│   ├── routes/
│   │   └── like.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```
## 📦 Installation

```bash
cd services/like-service
npm init -y
npm install express mongoose dotenv axios
npm install --save-dev nodemon
```

## 🧪 Tests manuels  
  
Utiliser Postman avec les routes suivantes :  
-   POST /api/users/register
-   POST /api/users/login
-   POST /api/users/forgot-password
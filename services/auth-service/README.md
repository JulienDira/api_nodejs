# 🧩 Microservice 1 : Auth-Service (Utilisateurs)  

## ➕ Fonctionnalités
-   Inscription sécurisée (bcrypt)
-   Connexion avec token (JWT recommandé)
-   Récupération de mot de passe (lien / OTP simplifié)
-   Validation des champs
-   Stockage MongoDB

## 📁 Structure interne du service
```bash
/auth-service
├── src/
│   ├── controllers/
│   │   └── user.controller.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── utils/
│   │   └── sendError.js
│   ├── app.js
│   └── server.js
├──  package.json
├── .env
├── package.json
└── README.md
```
## 📦 Installation

```bash
cd services/auth-service
npm init -y
npm install express mongoose bcrypt dotenv
npm install --save-dev nodemon
```

## 🧪 Tests manuels  
  
Utiliser Postman avec les routes suivantes :  
-   POST /api/users/register
-   POST /api/users/login
-   POST /api/users/forgot-password
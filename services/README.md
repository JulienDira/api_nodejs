# api_nodejs

```bash
/social-network-api
│
├── services/
│   ├── auth-service/             # Authentification et gestion utilisateurs
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── app.js
│   │   ├── .env
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── post-service/             # Gestion des publications
│   │   └── ...
│   │
│   ├── like-service/             # Gestion des likes
│   │   └── ...
│
├── docker-compose.yml            # Pour orchestrer tous les services
├── .env                          # Variables globales (ex: URLs des services)
└── README.md
```

## 🔧 Lancement

```bash
docker-compose up --build
```

## ⚙️ Outils utilisés  

-   Node.js + Express
-   MongoDB (via Docker ou Atlas)
-   bcrypt / argon2
-   Dotenv
-   nodemon (dev)
-   Docker / Docker Compose
-   Postman (tests manuels)
-   Jest / Supertest (tests automatisés)

## 🧩 Microservice 1 : Auth-Service (Utilisateurs)  

### ➕ Fonctionnalités
-   Inscription sécurisée (bcrypt)
-   Connexion avec token (JWT recommandé)
-   Récupération de mot de passe (lien / OTP simplifié)
-   Validation des champs
-   Stockage MongoDB
Documentation du projet Coworkspace (backend Go)

1️⃣ Installation et configuration initiale

    1. Cloner le projet
    git clone <repo-url>
    tapez dans le terminal : cd coworkspace/backend

    2. Installer les dépendances Go(terminal - toujours dans /backend)
    go mod tidy

    3. Créer le fichier .env

    Copier le fichier exemple :
    cp .env.example .env ou à la main copiez tout du fichier .env.example ensuite créez un fichier dans le backend .env et le collez la

    Modifier les variables selon votre environnement(s'il faut) (DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.).

    4. Préparer la base de données PostgreSQL

    Ouvrir PostgreSQL (pgAdmin4 ou terminal psql).

    Créer la base :
    CREATE DATABASE coworkspace;

    5. Migration initiale
        Dans main.go il y a un bloc pour exécuter le script SQL de migration (db/migrations/001_init.sql).
        Décommentez-le une seule fois pour créer les tables :

        // "os"
    // sqlBytes, err := os.ReadFile("db/migrations/001_init.sql")
    // if err != nil {
    // 	fmt.Printf("Impossible de lire le fichier de migration: %v\n", err)
    // 	panic(err)
    // }

    // _, err = db.DB.Exec(string(sqlBytes))
    // if err != nil {
    // 	fmt.Printf("Erreur lors de l'exécution de la migration: %v\n", err)
    // 	panic(err)
    // }

    // fmt.Println("Migration exécutée avec succès")

6. Démarrer le serveur
   go run main.go

   Si tout est bon, vous verrez :

   Connexion à la base des données réussie
   Migration exécutée avec succès
   Démarrage du serveur sur :8080...

   Commentez ce block(dans main.go) à nouveau pour eviter répetitions

2️⃣ Explication du fonctionnement général

    1. Middleware
    Le middleware est un intercepteur pour les requêtes HTTP.

    Exemple : AuthMiddleware vérifie que l’utilisateur a un token valide avant de continuer.

    UserMiddleware et AdminMiddleware vérifient le rôle de l’utilisateur (role = "user" ou "admin").

    Comment ça fonctionne simplement :

    L’utilisateur envoie une requête avec un cookie access_token.

    Le middleware lit ce cookie et le décode pour récupérer les informations (user_id, role).

    Si le token est invalide ou expiré → accès refusé.

    Sinon → les données sont stockées dans le Context pour les handlers suivants.

    Gestion des erreurs (utils)

    Toutes les réponses d’erreur ou succès passent par les fonctions dans utils.

    Exemple :
        utils.SendError(w, http.StatusUnauthorized, "TOKEN_EXPIRED")
        utils.SendSuccess(w, http.StatusOK, "Connexion réussie")

    Cela permet d’avoir un format cohérent dans toutes les réponses.

    Tokens JWT : access et refresh
        Access token : durée courte (15 minutes), contient l’ID utilisateur et le rôle.

        Refresh token : durée longue (7 jours), permet de générer un nouvel access token sans se reconnecter.

        Les deux tokens sont envoyés en cookies HttpOnly et lus dans les middlewares.

        L’accès aux données utilisateur dans les routes protégées se fait grâce au Context :
            userID := r.Context().Value(UserIDKey).(int)

    Rôles
        L’administrateur est ajouté dans la base grace à la migration,
        email: admin@coworkspace.com
        mot de passe : 11MMmm!!

        L'utilisateur est aussi ajouté dans la base grace à la migration,
        email: user@coworkspace.com
        mot de passe : 11MMmm!!

Si vous voulez ajouter un autre:
Processus de première connexion d’un utilisateur

Option 2
Avant tout:
Générer un App Password pour Gmail
Connectez-vous à votre compte Gmail.
Activez la Vérification en deux étapes si ce n’est pas déjà fait.
Allez dans : Gestion des mots de passe des applications: https://myaccount.google.com/apppasswords
Choisissez Mail comme application et Ordinateur comme appareil (ou autre nom significatif).
Cliquez sur Générer.
Copiez le mot de passe généré (16 caractères) et collez-le dans votre fichier .env sous SMTP_PASSWORD.
Ne partagez jamais ce mot de passe. Chaque membre de l’équipe doit générer le sien pour utiliser l’SMTP.

    Option 3
    Créer votre compte directement dans la base de données:
    -- Créer un utilisateur standard directement dans la base de données
        INSERT INTO "user"
        (email, password, first_name, last_name, role, status, email_verified)
        VALUES
        (
        'user@coworkspace.com',
        '$2a$10$rIAiOvbRIFuTK8rSTTANLuN1hEUcYkgSg4VD4YIwYUBF69ftf8qy.', -- exemple de hash bcrypt
        'John',
        'Doe',
        'user',
        'active',
        true
        );

        email pour la connexion: user@coworkspace.com, mot de passe: 11MMmm!!

1.  L’utilisateur s’inscrit via /register.
2.  Le serveur génère un token de vérification et envoie un email avec un lien :
    http://localhost:8080/verify-email?token=<token>

3.  L’utilisateur clique sur le lien → /verify-email → email vérifié et compte activé (status = active).

4.  Ensuite, il peut se connecter via /login.

5.  Lors de la connexion :
    Access token et refresh token sont créés.
    Stockés dans des cookies HttpOnly.
    Les middlewares utilisent ces tokens pour sécuriser les routes.

Architecture du projet

Le backend du projet est organisé selon une architecture simple et modulaire afin de séparer les responsabilités et faciliter le travail en équipe.

Structure du projet :

backend/
│
├── controllers/ # Logique des endpoints (gestion des requêtes HTTP)
├── middleware/ # Middlewares (authentification, rôles, CORS, etc.)
├── routes/ # Définition des routes de l'API
├── services/ # Logique métier (emails, etc.)
├── utils/ # Fonctions utilitaires (tokens, gestion des réponses)
├── validation/ # Validation des données (email, mot de passe, etc.)
│
├── db/
│ └── migrations/ # Scripts SQL pour créer les tables
│
├── models/ # Structures Go représentant les tables de la base
│
├── config/ # Chargement de la configuration (.env)
│
├── main.go # Point d'entrée de l'application
├── go.mod # Dépendances du projet
└── .env.example # Exemple de configuration

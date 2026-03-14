-- ============================================
-- Migration de la base de données pour CoWork'Space
-- ============================================

-- ==========================
-- Table des utilisateurs
-- ==========================
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,       -- Email unique pour l'utilisateur
    password VARCHAR(255) NOT NULL,           -- Mot de passe hashé
    first_name VARCHAR(100),                  -- Prénom de l'utilisateur
    last_name VARCHAR(100),                   -- Nom de famille
    phone VARCHAR(20),                        -- Numéro de téléphone
    profile_picture TEXT,                     -- Photo de profil (URL ou base64)
    role VARCHAR(50) DEFAULT 'user',          -- Rôle: 'user' ou 'admin'
    status VARCHAR(20) DEFAULT 'pending',     -- Statut: 'pending' (en attente) ou 'active'
    email_verified BOOLEAN DEFAULT FALSE,     -- Confirmation d'email
    verification_token TEXT,                  -- Token pour la confirmation d'email
    created_at TIMESTAMP DEFAULT NOW(),       -- Date de création
    updated_at TIMESTAMP DEFAULT NOW()        -- Date de mise à jour
);

-- ==========================
-- Enum type pour le type d'espace
-- ==========================
CREATE TYPE space_type AS ENUM (
    'meeting_room',     -- Salle de réunion
    'open_space',       -- Espace de travail partagé
    'private_office'    -- Bureau privé
);

-- ==========================
-- Table des espaces (salles)
-- ==========================

CREATE TABLE space (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                -- Nom de l'espace
    type space_type NOT NULL,                  -- Type d'espace (meeting_room, open_space, private_office)
    capacity INT,                              -- Nombre de places disponibles
    location_label VARCHAR(255),               -- Étiquette de localisation (ex: étage 1)
    plan_image TEXT,                           -- Chemin vers l'image du plan de la salle
    is_active BOOLEAN DEFAULT TRUE,            -- Indique si l'espace est disponible
    created_at TIMESTAMP DEFAULT NOW(),        -- Date de création
    updated_at TIMESTAMP DEFAULT NOW()         -- Date de mise à jour
);

-- ==========================
-- Table des postes (bureaux individuels)
-- ==========================

CREATE TABLE desk (
    id SERIAL PRIMARY KEY,
    space_id INT NOT NULL,                     -- Référence vers l'espace auquel appartient le poste
    name VARCHAR(100),                         -- Nom ou identifiant du poste (ex: Desk A1)
    position_x INT,                            -- Position horizontale dans le plan (pour la visualisation)
    position_y INT,                            -- Position verticale dans le plan (pour la visualisation)
    is_active BOOLEAN DEFAULT TRUE,            -- Indique si le poste est disponible
    created_at TIMESTAMP DEFAULT NOW(),        -- Date de création
    updated_at TIMESTAMP DEFAULT NOW(),        -- Date de mise à jour
    CONSTRAINT fk_desk_space
    FOREIGN KEY (space_id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE INDEX idx_desk_space_id ON desk(space_id);


-- ==========================
-- Enum type pour le type d'espace
-- ==========================
CREATE TYPE reservation_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled'
);

-- ==========================
-- Table des réservations
-- ==========================
CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,                      -- Utilisateur qui réserve
    space_id INT,                              -- Salle réservée (meeting room)
    desk_id INT,                               -- Poste réservé (open space)
    start_at TIMESTAMP NOT NULL,               -- Début de la réservation
    end_at TIMESTAMP NOT NULL,                 -- Fin de la réservation
    status VARCHAR(50) DEFAULT 'pending',     -- Statut: 'pending', 'confirmed', 'cancelled'
    visibility VARCHAR(50) DEFAULT 'private', -- Visibilité: 'private' ou 'public'
    title VARCHAR(255),                        -- Titre de la réservation
    notes TEXT,                                -- Notes supplémentaires
    series_id INT,                             -- Identifiant pour les séries récurrentes
    recurrence_rule VARCHAR(255),              -- Règle de récurrence
    recurrence_end_at TIMESTAMP,               -- Date de fin de la récurrence
    created_at TIMESTAMP DEFAULT NOW(),        -- Date de création
    updated_at TIMESTAMP DEFAULT NOW(),        -- Date de mise à jour

    CONSTRAINT fk_reservation_user 
        FOREIGN KEY(user_id) REFERENCES "user"(id) ON DELETE CASCADE,

    CONSTRAINT fk_reservation_space 
        FOREIGN KEY(space_id) REFERENCES space(id) ON DELETE CASCADE,

    CONSTRAINT fk_reservation_desk 
        FOREIGN KEY(desk_id) REFERENCES desk(id) ON DELETE CASCADE
);

-- Index pour accélérer les recherches fréquentes
CREATE INDEX idx_reservation_user_id ON reservation(user_id);
CREATE INDEX idx_reservation_space_id ON reservation(space_id);
CREATE INDEX idx_reservation_start_at ON reservation(start_at);

-- ==========================
-- Table des notifications
-- ==========================
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,                       -- Utilisateur à notifier
    reservation_id INT NOT NULL,                -- Réservation concernée
    type VARCHAR(50),                           -- Type: 'confirmation', 'reminder', 'cancellation'
    status VARCHAR(50) DEFAULT 'pending',       -- Statut de la notification
    scheduled_at TIMESTAMP,                     -- Date prévue de l'envoi
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_notification_user FOREIGN KEY(user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_reservation FOREIGN KEY(reservation_id) REFERENCES reservation(id) ON DELETE CASCADE
);

-- ==========================
-- Table des équipements
-- ==========================
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                 -- Nom de l'équipement (ex: vidéoprojecteur)
    quantity INT DEFAULT 1,                     -- Quantité disponible
    space_id INT NOT NULL,                      -- Espace auquel l'équipement appartient
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_equipment_space FOREIGN KEY(space_id) REFERENCES space(id) ON DELETE CASCADE
);

-- ==========================
-- Compte administrateur par défaut
-- ==========================
INSERT INTO "user"
(email, password, first_name, last_name, phone, profile_picture, role, status, email_verified, verification_token)
VALUES
(
  'admin@coworkspace.com',
  '$2a$10$rIAiOvbRIFuTK8rSTTANLuN1hEUcYkgSg4VD4YIwYUBF69ftf8qy.', -- hash pour le mot de passe "11MMmm!!"
  'Admin',
  'System',
  NULL,
  NULL,
  'admin',
  'active',
  true,
  NULL
);

-- ==========================
-- Compte user par défaut
-- ==========================

INSERT INTO "user"
(email, password, first_name, last_name, phone, profile_picture, role, status, email_verified, verification_token)
VALUES
(
  'user@coworkspace.com',
  '$2a$10$rIAiOvbRIFuTK8rSTTANLuN1hEUcYkgSg4VD4YIwYUBF69ftf8qy.', -- hash pour le mot de passe "11MMmm!!"
  'John',
  'Doe',
  NULL,
  NULL,
  'user',
  'active',
  true,
  NULL
);
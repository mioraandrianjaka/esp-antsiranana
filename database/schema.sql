-- database/schema.sql
-- Créez d'abord la base de données dans phpMyAdmin: esp_antsiranana
-- Puis exécutez ce script dans l'onglet SQL

-- Table utilisateur (admin)
CREATE TABLE user (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table actualités
CREATE TABLE actualite (
    id_actu INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES user(id_user)
);

-- Table formations
CREATE TABLE formation (
    id_formation INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(150) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    niveau ENUM('Licence', 'Master') DEFAULT 'Licence',
    responsable_nom VARCHAR(100),
    created_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES user(id_user)
);

-- Table détails formation (débouchés, parcours)
CREATE TABLE formation_detail (
    id_detail INT PRIMARY KEY AUTO_INCREMENT,
    id_formation INT,
    type ENUM('debouché', 'parcours', 'module') NOT NULL,
    contenu TEXT NOT NULL,
    ordre INT DEFAULT 0,
    FOREIGN KEY (id_formation) REFERENCES formation(id_formation) ON DELETE CASCADE
);

-- Table classes
CREATE TABLE classe (
    id_classe INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,  -- ex: "L1 TCI", "L2 GET"
    id_formation INT,
    annee INT,  -- 1, 2, 3
    mot_de_passe VARCHAR(255),  -- hashé avec bcrypt
    FOREIGN KEY (id_formation) REFERENCES formation(id_formation)
);

-- Table emplois du temps
CREATE TABLE emploi_temps (
    id_edt INT PRIMARY KEY AUTO_INCREMENT,
    id_classe INT,
    fichier_url VARCHAR(500) NOT NULL,
    semestre ENUM('S1', 'S2') NOT NULL,
    annee_academique VARCHAR(20),  -- ex: "2025-2026"
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES user(id_user)
);

-- Table résultats
CREATE TABLE resultat (
    id_resultat INT PRIMARY KEY AUTO_INCREMENT,
    id_classe INT,
    fichier_url VARCHAR(500) NOT NULL,
    type ENUM('notes', 'deliberation') DEFAULT 'notes',
    semestre ENUM('S1', 'S2') NOT NULL,
    annee_academique VARCHAR(20),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES user(id_user)
);

-- Table cours fichiers
CREATE TABLE cours_fichier (
    id_fichier INT PRIMARY KEY AUTO_INCREMENT,
    id_classe INT,
    titre VARCHAR(200) NOT NULL,
    fichier_url VARCHAR(500) NOT NULL,
    type_fichier VARCHAR(50),
    uploaded_by_email VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    downloads_count INT DEFAULT 0,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE
);

-- Table alumni
CREATE TABLE alumni (
    id_alumni INT PRIMARY KEY AUTO_INCREMENT,
    nom_complet VARCHAR(150) NOT NULL,
    promotion VARCHAR(50),
    filiere VARCHAR(100),
    annee_sortie INT,
    email VARCHAR(100),
    statut_validation ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table inscriptions
CREATE TABLE inscription (
    id_inscription INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    classe_demandee INT,
    statut ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classe_demandee) REFERENCES classe(id_classe)
);

-- Table paramètres (pour activer/désactiver inscriptions)
CREATE TABLE parametre (
    id_param INT PRIMARY KEY AUTO_INCREMENT,
    cle VARCHAR(50) UNIQUE NOT NULL,
    valeur VARCHAR(50) NOT NULL,
    description TEXT
);

-- Insertion des formations (d'après votre description)
INSERT INTO formation (nom, code, description, responsable_nom) VALUES
('Science et Technique Informatique et Communication', 'STIC', 'Se focalise sur l''électronique et l''informatique...', 'À définir'),
('Génie Civil', 'GC', 'Met l''accent sur le génie civil, englobant la construction...', 'À définir'),
('Génie Mécanique', 'GM', 'Englobe la conception, la fabrication et la maintenance...', 'À définir'),
('Génie Electrique', 'GE', 'Traite de la conception, de la gestion et de la maintenance...', 'À définir'),
('Hydraulique et Energétique', 'HE', 'Les étudiants apprennent à concevoir et gérer...', 'À définir'),
('Génie Electrique et Technologique', 'GET', 'Forme des techniciens supérieurs polyvalents...', 'Mme FINOMANA Lydia'),
('Technologie Numérique et Communication', 'TNC', 'Forme des professionnels capables de concevoir...', 'À définir'),
('Génie Mécanique et Hydraulique', 'GMH', 'Formation croisée en mécanique et hydraulique...', 'À définir');

-- Insertion des classes
INSERT INTO classe (nom, id_formation, annee, mot_de_passe) VALUES
('L1 TCI', 1, 1, '$2b$10$ExempleDeHashQueNousFeronsPlusTard'),  -- mot de passe: "tci2025"
('L2 STIC', 1, 2, '$2b$10$Xj3kLpQrStUvWxYzAbCdEf'),  -- mot de passe: "stic2025"
('L2 GC', 2, 2, '$2b$10$GhIjKlMnOpQrStUvWxYzA'),   -- mot de passe: "gc2025"
('L2 GM', 3, 2, '$2b$10$BcDeFgHiJkLmNoPqRsTuVw'),   -- mot de passe: "gm2025"
('L2 GE', 4, 2, '$2b$10$XyZaBcDeFgHiJkLmNoPqR'),    -- mot de passe: "ge2025"
('L2 HE', 5, 2, '$2b$10$sTuVwXyZaBcDeFgHiJkLm'),    -- mot de passe: "he2025"
('L2 GET', 6, 2, '$2b$10$NoPqRsTuVwXyZaBcDeFgH'),   -- mot de passe: "get2025"
('L2 TNC', 7, 2, '$2b$10$iJkLmNoPqRsTuVwXyZaBc'),    -- mot de passe: "tnc2025"
('L2 GMH', 8, 2, '$2b$10$DeFgHiJkLmNoPqRsTuVwX'),    -- mot de passe: "gmh2025"
('L3 STIC', 1, 3, '$2b$10$yZaBcDeFgHiJkLmNoPqRs'),
('L3 GC', 2, 3, '$2b$10$TuVwXyZaBcDeFgHiJkLmN'),
('L3 GM', 3, 3, '$2b$10$oPqRsTuVwXyZaBcDeFgHi'),
('L3 GE', 4, 3, '$2b$10$JkLmNoPqRsTuVwXyZaBcD'),
('L3 HE', 5, 3, '$2b$10$eFgHiJkLmNoPqRsTuVwXy'),
('L3 GET', 6, 3, '$2b$10$ZaBcDeFgHiJkLmNoPqRsT'),
('L3 TNC', 7, 3, '$2b$10$uVwXyZaBcDeFgHiJkLmNo'),
('L3 GMH', 8, 3, '$2b$10$PqRsTuVwXyZaBcDeFgHiJ');

-- Insertion admin (mot de passe: admin123)
INSERT INTO user (email, password_hash) VALUES 
('admin@espantsiranana.mg', '$2b$10$YourHashHere'); -- On va générer ce hash plus tard

-- Insertion paramètres
INSERT INTO parametre (cle, valeur, description) VALUES 
('inscriptions_ouvertes', 'false', 'Permet d''activer ou désactiver les inscriptions en ligne'),
('annee_academique', '2025-2026', 'Année académique en cours');
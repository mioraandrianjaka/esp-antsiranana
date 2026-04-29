// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// S'assurer que le dossier uploads existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware - CORS qui accepte toutes les origines
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
// Configuration multer pour les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorise'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// ========== ROUTES PUBLIQUES ==========

// Accueil - dernieres actualites
app.get('/api/actualites', async (req, res) => {
    try {
        const [actualites] = await db.execute(
            'SELECT * FROM actualite ORDER BY date_publication DESC LIMIT 6'
        );
        res.json(actualites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Liste des formations
app.get('/api/formations', async (req, res) => {
    try {
        const [formations] = await db.execute('SELECT * FROM formation');
        res.json(formations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Detail d'une formation
app.get('/api/formations/:code', async (req, res) => {
    try {
        const [formation] = await db.execute(
            'SELECT * FROM formation WHERE code = ?',
            [req.params.code]
        );
        if (formation.length === 0) {
            return res.status(404).json({ error: 'Formation non trouvee' });
        }
        
        const [details] = await db.execute(
            'SELECT * FROM formation_detail WHERE id_formation = ? ORDER BY ordre',
            [formation[0].id_formation]
        );
        
        res.json({ ...formation[0], details });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recherche emploi du temps
app.get('/api/emploi-temps', async (req, res) => {
    try {
        const { classe } = req.query;
        if (!classe) {
            return res.status(400).json({ error: 'Classe requise' });
        }
        
        const [edt] = await db.execute(
            `SELECT e.* FROM emploi_temps e
             JOIN classe c ON e.id_classe = c.id_classe
             WHERE c.nom = ? 
             ORDER BY e.uploaded_at DESC LIMIT 1`,
            [classe]
        );
        
        res.json(edt[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recherche resultats
app.get('/api/resultats', async (req, res) => {
    try {
        const { classe } = req.query;
        if (!classe) {
            return res.status(400).json({ error: 'Classe requise' });
        }
        
        const [resultat] = await db.execute(
            `SELECT r.* FROM resultat r
             JOIN classe c ON r.id_classe = c.id_classe
             WHERE c.nom = ? 
             ORDER BY r.uploaded_at DESC LIMIT 1`,
            [classe]
        );
        
        res.json(resultat[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verification mot de passe classe (pour acces cours)
app.post('/api/cours/verify', async (req, res) => {
    try {
        const { classe, password } = req.body;
        
        const [rows] = await db.execute(
            'SELECT id_classe, mot_de_passe FROM classe WHERE nom = ?',
            [classe]
        );
        
        if (rows.length === 0) {
            return res.json({ success: false, message: 'Classe non trouvee' });
        }
        
        const valid = await bcrypt.compare(password, rows[0].mot_de_passe);
        res.json({ success: valid, id_classe: rows[0].id_classe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recuperer les cours d'une classe (apres verification)
app.get('/api/cours/:id_classe', async (req, res) => {
    try {
        const [fichiers] = await db.execute(
            'SELECT * FROM cours_fichier WHERE id_classe = ? ORDER BY uploaded_at DESC',
            [req.params.id_classe]
        );
        res.json(fichiers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload de fichier cours (accessible apres verification mot de passe)
app.post('/api/cours/upload', upload.single('fichier'), async (req, res) => {
    try {
        const { id_classe, uploaded_by_email, titre } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier uploadé' });
        }
        
        const fichier_url = `/uploads/${req.file.filename}`;
        const titreFichier = titre || req.file.originalname;
        
        await db.execute(
            `INSERT INTO cours_fichier (id_classe, titre, fichier_url, type_fichier, uploaded_by_email)
             VALUES (?, ?, ?, ?, ?)`,
            [id_classe, titreFichier, fichier_url, req.file.mimetype, uploaded_by_email]
        );
        
        res.json({ success: true, message: 'Fichier uploade avec succes' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Liste des classes (pour les formulaires)
app.get('/api/classes', async (req, res) => {
    try {
        const [classes] = await db.execute(
            'SELECT c.*, f.nom as formation_nom FROM classe c LEFT JOIN formation f ON c.id_formation = f.id_formation'
        );
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verifier si inscriptions ouvertes
app.get('/api/inscriptions/statut', async (req, res) => {
    try {
        const [param] = await db.execute(
            "SELECT valeur FROM parametre WHERE cle = 'inscriptions_ouvertes'"
        );
        const ouvert = param[0]?.valeur === 'true';
        res.json({ ouvert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Soumettre une inscription
app.post('/api/inscriptions', async (req, res) => {
    try {
        // Verifier si inscriptions ouvertes
        const [param] = await db.execute(
            "SELECT valeur FROM parametre WHERE cle = 'inscriptions_ouvertes'"
        );
        if (param[0]?.valeur !== 'true') {
            return res.status(403).json({ error: 'Les inscriptions sont fermees' });
        }
        
        const { nom, prenom, email, telephone, classe_demandee } = req.body;
        
        // Validation basique
        if (!nom || !prenom || !email || !classe_demandee) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        await db.execute(
            `INSERT INTO inscription (nom, prenom, email, telephone, classe_demandee)
             VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, telephone, classe_demandee]
        );
        
        res.json({ success: true, message: 'Inscription enregistree' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Liste des alumni (valides)
app.get('/api/alumni', async (req, res) => {
    try {
        const [alumni] = await db.execute(
            "SELECT * FROM alumni WHERE statut_validation = 'approved' ORDER BY annee_sortie DESC"
        );
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contribution alumni
app.post('/api/alumni', async (req, res) => {
    try {
        const { nom_complet, promotion, filiere, annee_sortie, email } = req.body;
        
        if (!nom_complet || !filiere) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        await db.execute(
            `INSERT INTO alumni (nom_complet, promotion, filiere, annee_sortie, email, statut_validation)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [nom_complet, promotion, filiere, annee_sortie, email]
        );
        
        res.json({ success: true, message: 'Contribution envoyee pour validation' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== ROUTES ADMIN (protegees) ==========

// Login admin
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await db.execute(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        const valid = await bcrypt.compare(password, users[0].password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        const token = jwt.sign(
            { id: users[0].id_user, email: users[0].email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );
        
        res.json({ 
            token, 
            user: { id: users[0].id_user, email: users[0].email } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Actualites
app.get('/api/admin/actualites', auth, async (req, res) => {
    try {
        const [actualites] = await db.execute(
            'SELECT a.*, u.email as auteur FROM actualite a LEFT JOIN user u ON a.created_by = u.id_user ORDER BY date_publication DESC'
        );
        res.json(actualites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/actualites', auth, upload.single('image'), async (req, res) => {
    try {
        const { titre, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        const [result] = await db.execute(
            'INSERT INTO actualite (titre, description, image_url, created_by) VALUES (?, ?, ?, ?)',
            [titre, description, image_url, req.user.id]
        );
        
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/actualites/:id', auth, async (req, res) => {
    try {
        const { titre, description } = req.body;
        await db.execute(
            'UPDATE actualite SET titre = ?, description = ? WHERE id_actu = ?',
            [titre, description, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/actualites/:id', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM actualite WHERE id_actu = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD Formations
app.get('/api/admin/formations', auth, async (req, res) => {
    try {
        const [formations] = await db.execute('SELECT * FROM formation');
        res.json(formations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/formations', auth, async (req, res) => {
    try {
        const { nom, code, description, responsable_nom } = req.body;
        const [result] = await db.execute(
            'INSERT INTO formation (nom, code, description, responsable_nom, created_by) VALUES (?, ?, ?, ?, ?)',
            [nom, code, description, responsable_nom, req.user.id]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/formations/:id', auth, async (req, res) => {
    try {
        const { nom, code, description, responsable_nom } = req.body;
        await db.execute(
            'UPDATE formation SET nom = ?, code = ?, description = ?, responsable_nom = ? WHERE id_formation = ?',
            [nom, code, description, responsable_nom, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/formations/:id', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM formation WHERE id_formation = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gestion des classes
app.get('/api/admin/classes', auth, async (req, res) => {
    try {
        const [classes] = await db.execute(
            'SELECT c.*, f.nom as formation_nom FROM classe c LEFT JOIN formation f ON c.id_formation = f.id_formation'
        );
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/classes/:id/motdepasse', auth, async (req, res) => {
    try {
        const { mot_de_passe } = req.body;
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        await db.execute(
            'UPDATE classe SET mot_de_passe = ? WHERE id_classe = ?',
            [hashedPassword, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload emploi du temps
app.post('/api/admin/emploi-temps', auth, upload.single('fichier'), async (req, res) => {
    try {
        const { id_classe, semestre, annee_academique, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier uploade' });
        }
        
        const fichier_url = `/uploads/${req.file.filename}`;
        
        await db.execute(
            `INSERT INTO emploi_temps (id_classe, fichier_url, semestre, annee_academique, uploaded_by)
             VALUES (?, ?, ?, ?, ?)`,
            [id_classe, fichier_url, semestre, annee_academique, req.user.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload resultats
app.post('/api/admin/resultats', auth, upload.single('fichier'), async (req, res) => {
    try {
        const { id_classe, type, semestre, annee_academique, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier uploade' });
        }
        
        const fichier_url = `/uploads/${req.file.filename}`;
        
        await db.execute(
            `INSERT INTO resultat (id_classe, fichier_url, type, semestre, annee_academique, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_classe, fichier_url, type, semestre, annee_academique, req.user.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gestion inscriptions (liste + validation)
app.get('/api/admin/inscriptions', auth, async (req, res) => {
    try {
        const [inscriptions] = await db.execute(
            `SELECT i.*, c.nom as classe_nom 
             FROM inscription i 
             LEFT JOIN classe c ON i.classe_demandee = c.id_classe 
             ORDER BY i.date_inscription DESC`
        );
        res.json(inscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/inscriptions/:id/statut', auth, async (req, res) => {
    try {
        const { statut } = req.body;
        await db.execute(
            'UPDATE inscription SET statut = ? WHERE id_inscription = ?',
            [statut, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gestion parametres (inscriptions ouvertes/fermees)
app.get('/api/admin/parametres', auth, async (req, res) => {
    try {
        const [params] = await db.execute('SELECT * FROM parametre');
        res.json(params);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/parametres/:cle', auth, async (req, res) => {
    try {
        const { valeur } = req.body;
        await db.execute(
            'UPDATE parametre SET valeur = ? WHERE cle = ?',
            [valeur, req.params.cle]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gestion alumni (validation)
app.get('/api/admin/alumni', auth, async (req, res) => {
    try {
        const [alumni] = await db.execute(
            "SELECT * FROM alumni WHERE statut_validation = 'pending' ORDER BY submitted_at DESC"
        );
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/alumni/:id/valider', auth, async (req, res) => {
    try {
        await db.execute(
            "UPDATE alumni SET statut_validation = 'approved' WHERE id_alumni = ?",
            [req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/alumni/:id', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM alumni WHERE id_alumni = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Changer le mot de passe admin
app.post('/api/admin/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        
        // Récupérer l'utilisateur
        const [users] = await db.execute(
            'SELECT * FROM user WHERE id_user = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        // Vérifier l'ancien mot de passe
        const valid = await bcrypt.compare(currentPassword, users[0].password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }
        
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Mettre à jour
        await db.execute(
            'UPDATE user SET password_hash = ? WHERE id_user = ?',
            [hashedPassword, req.user.id]
        );
        
        res.json({ success: true, message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Demarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur demarre sur le port ${PORT}`);
});

// Récupérer tous les EDT
app.get('/api/admin/emplois-temps', auth, async (req, res) => {
    try {
        const [emplois] = await db.execute(`
            SELECT e.*, c.nom as classe_nom 
            FROM emploi_temps e 
            LEFT JOIN classe c ON e.id_classe = c.id_classe 
            ORDER BY e.uploaded_at DESC
        `);
        res.json(emplois);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer tous les résultats
app.get('/api/admin/resultats-list', auth, async (req, res) => {
    try {
        const [resultats] = await db.execute(`
            SELECT r.*, c.nom as classe_nom 
            FROM resultat r 
            LEFT JOIN classe c ON r.id_classe = c.id_classe 
            ORDER BY r.uploaded_at DESC
        `);
        res.json(resultats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer tous les documents cours
app.get('/api/admin/cours-files', auth, async (req, res) => {
    try {
        const [fichiers] = await db.execute(`
            SELECT cf.*, c.nom as classe_nom 
            FROM cours_fichier cf 
            LEFT JOIN classe c ON cf.id_classe = c.id_classe 
            ORDER BY cf.uploaded_at DESC
        `);
        res.json(fichiers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un document
app.delete('/api/admin/document/:type/:id', auth, async (req, res) => {
    try {
        const { type, id } = req.params;
        let table = '';
        let idField = '';
        
        if (type === 'edt') {
            table = 'emploi_temps';
            idField = 'id_edt';
        } else if (type === 'resultat') {
            table = 'resultat';
            idField = 'id_resultat';
        } else if (type === 'cours') {
            table = 'cours_fichier';
            idField = 'id_fichier';
        } else {
            return res.status(400).json({ error: 'Type invalide' });
        }
        
        await db.execute(`DELETE FROM ${table} WHERE ${idField} = ?`, [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
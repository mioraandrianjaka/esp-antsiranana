// backend/scripts/seed-data.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'esp_antsiranana'
    });
    
    console.log('[1/7] Nettoyage des tables dans le bon ordre...');
    
    // Supprimer dans l'ordre inverse pour respecter les clés étrangères
    await connection.execute('DELETE FROM cours_fichier');
    await connection.execute('DELETE FROM emploi_temps');
    await connection.execute('DELETE FROM resultat');
    await connection.execute('DELETE FROM inscription');
    await connection.execute('DELETE FROM classe');
    await connection.execute('DELETE FROM formation_detail');
    await connection.execute('DELETE FROM actualite');
    await connection.execute('DELETE FROM alumni');
    await connection.execute('DELETE FROM formation');
    
    console.log('[2/7] Insertion des formations...');
    
    // Insertion des formations
    const formations = [
        ['Science et Technique Informatique et Communication', 'STIC', 'Se focalise sur l\'electronique et l\'informatique, offrant aux étudiants des compétences essentielles dans le domaine des technologies de l\'information et de la communication.', 'A definir'],
        ['Genie Civil', 'GC', 'Met l\'accent sur le genie civil, englobant la construction et les travaux publics. Les étudiants acquierent des compétences en conception, planification et gestion de projets d\'infrastructure.', 'A definir'],
        ['Genie Mecanique', 'GM', 'Englobe la conception, la fabrication et la maintenance des machines et des systemes mecaniques.', 'A definir'],
        ['Genie Electrique', 'GE', 'Traite de la conception, de la gestion et de la maintenance des systemes electriques et electroniques.', 'A definir'],
        ['Hydraulique Energetique', 'HE', 'Les étudiants apprennent à concevoir et gerer des systemes hydrauliques et energetiques.', 'A definir'],
        ['Genie Electrique et Technologique', 'GET', 'Forme des techniciens superieurs polyvalents, aptes à intervenir dans les domaines de l\'electricite, de l\'electronique et de l\'automatisme.', 'Mme FINOMANA Lydia'],
        ['Technologie Numerique et Communication', 'TNC', 'Forme des professionnels capables de concevoir, developper et administrer des systemes numeriques et de communication.', 'A definir'],
        ['Genie Mecanique et Hydraulique', 'GMH', 'Formation croisee en mecanique et hydraulique, ouvrant sur des secteurs cles comme les equipements industriels et l\'hydroelectricite.', 'A definir']
    ];
    
    for (const f of formations) {
        await connection.execute(
            'INSERT INTO formation (nom, code, description, responsable_nom) VALUES (?, ?, ?, ?)',
            f
        );
    }
    
    console.log('[3/7] Insertion des classes...');
    
    // Recuperer les IDs des formations
    const [formationRows] = await connection.execute('SELECT id_formation, code FROM formation');
    const formationMap = {};
    formationRows.forEach(row => {
        formationMap[row.code] = row.id_formation;
    });
    
    // Insertion des classes
    const classes = [
        ['L1 TCI', formationMap['STIC'], 1],
        ['L2 STIC', formationMap['STIC'], 2],
        ['L2 GC', formationMap['GC'], 2],
        ['L2 GM', formationMap['GM'], 2],
        ['L2 GE', formationMap['GE'], 2],
        ['L2 HE', formationMap['HE'], 2],
        ['L2 GET', formationMap['GET'], 2],
        ['L2 TNC', formationMap['TNC'], 2],
        ['L2 GMH', formationMap['GMH'], 2],
        ['L3 STIC', formationMap['STIC'], 3],
        ['L3 GC', formationMap['GC'], 3],
        ['L3 GM', formationMap['GM'], 3],
        ['L3 GE', formationMap['GE'], 3],
        ['L3 HE', formationMap['HE'], 3],
        ['L3 GET', formationMap['GET'], 3],
        ['L3 TNC', formationMap['TNC'], 3],
        ['L3 GMH', formationMap['GMH'], 3]
    ];
    
    for (const c of classes) {
        await connection.execute(
            'INSERT INTO classe (nom, id_formation, annee, mot_de_passe) VALUES (?, ?, ?, ?)',
            [c[0], c[1], c[2], 'temp']
        );
    }
    
    console.log('[4/7] Mise à jour des mots de passe des classes...');
    
    // Mettre à jour les mots de passe
    const classPasswords = {
        'L1 TCI': 'tci2025',
        'L2 STIC': 'stic2025',
        'L2 GC': 'gc2025',
        'L2 GM': 'gm2025',
        'L2 GE': 'ge2025',
        'L2 HE': 'he2025',
        'L2 GET': 'get2025',
        'L2 TNC': 'tnc2025',
        'L2 GMH': 'gmh2025',
        'L3 STIC': 'stic2025',
        'L3 GC': 'gc2025',
        'L3 GM': 'gm2025',
        'L3 GE': 'ge2025',
        'L3 HE': 'he2025',
        'L3 GET': 'get2025',
        'L3 TNC': 'tnc2025',
        'L3 GMH': 'gmh2025'
    };
    
    for (const [className, password] of Object.entries(classPasswords)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            'UPDATE classe SET mot_de_passe = ? WHERE nom = ?',
            [hashedPassword, className]
        );
    }
    
    console.log('[5/7] Insertion des details de formations...');
    
    // Details pour GET (exemple)
    const [getFormation] = await connection.execute(
        "SELECT id_formation FROM formation WHERE code = 'GET'"
    );
    
    if (getFormation.length > 0) {
        const getDetails = [
            [getFormation[0].id_formation, 'parcours', 'Electronique, Informatique et Technologie - orientation vers le developpement de systemes electroniques et informatiques industriels', 1],
            [getFormation[0].id_formation, 'parcours', 'Electricite, Electronique et Automatique - specialisation en conception d\'installations electriques', 2],
            [getFormation[0].id_formation, 'debouché', 'Industrie manufacturiere', 1],
            [getFormation[0].id_formation, 'debouché', 'Distribution d\'energie', 2],
            [getFormation[0].id_formation, 'debouché', 'Services de maintenance technique', 3]
        ];
        
        for (const detail of getDetails) {
            await connection.execute(
                'INSERT INTO formation_detail (id_formation, type, contenu, ordre) VALUES (?, ?, ?, ?)',
                detail
            );
        }
    }
    
    console.log('[6/7] Verification du compte admin...');
    
    // Verifier si l'admin existe, le creer sinon
    const [adminExists] = await connection.execute(
        "SELECT * FROM user WHERE email = 'admin@espantsiranana.mg'"
    );
    
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    
    if (adminExists.length === 0) {
        await connection.execute(
            "INSERT INTO user (email, password_hash) VALUES (?, ?)",
            ['admin@espantsiranana.mg', adminPasswordHash]
        );
        console.log('[OK] Compte admin cree');
    } else {
        await connection.execute(
            "UPDATE user SET password_hash = ? WHERE email = 'admin@espantsiranana.mg'",
            [adminPasswordHash]
        );
        console.log('[OK] Mot de passe admin mis à jour');
    }
    
    console.log('[7/7] Insertion des parametres...');
    
    // Verifier si les parametres existent
    const [existingParams] = await connection.execute("SELECT cle FROM parametre");
    const existingKeys = existingParams.map(p => p.cle);
    
    const parametres = [
        ['inscriptions_ouvertes', 'false', 'Permet d activer ou desactiver les inscriptions en ligne'],
        ['annee_academique', '2025-2026', 'Annee academique en cours']
    ];
    
    for (const p of parametres) {
        if (existingKeys.includes(p[0])) {
            await connection.execute(
                'UPDATE parametre SET valeur = ?, description = ? WHERE cle = ?',
                [p[1], p[2], p[0]]
            );
        } else {
            await connection.execute(
                'INSERT INTO parametre (cle, valeur, description) VALUES (?, ?, ?)',
                p
            );
        }
    }
    
    // Insertion d'une actualite de test si la table est vide
    const [actualiteCount] = await connection.execute('SELECT COUNT(*) as count FROM actualite');
    if (actualiteCount[0].count === 0) {
        const [admin] = await connection.execute("SELECT id_user FROM user WHERE email = 'admin@espantsiranana.mg'");
        if (admin.length > 0) {
            await connection.execute(
                `INSERT INTO actualite (titre, description, created_by) 
                 VALUES (?, ?, ?)`,
                ['Bienvenue sur le nouveau site de l\'ESP Antsiranana', 
                 'Nous sommes ravis de vous presenter notre nouvelle plateforme. Restez connectes pour suivre toutes les actualites de l\'ecole et les informations concernant les inscriptions.',
                 admin[0].id_user]
            );
            console.log('[OK] Actualite de test ajoutee');
        }
    }
    
    console.log('');
    console.log('========== RESUME FINAL ==========');
    console.log(' Formations creees : ' + formations.length);
    console.log(' Classes creees : ' + classes.length);
    console.log(' Admin : admin@espantsiranana.mg');
    console.log(' Mot de passe admin : admin123');
    console.log('');
    console.log('Mots de passe des classes (pour tester) :');
    console.log(' - L1 TCI : tci2025');
    console.log(' - L2 GET : get2025');
    console.log(' - L2 STIC : stic2025');
    console.log(' - L2 GC : gc2025');
    console.log('===================================');
    
    await connection.end();
}

seedData().catch(console.error);
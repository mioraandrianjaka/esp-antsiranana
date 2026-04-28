// backend/scripts/init-db.js
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'esp_antsiranana'
    });
    
    // Generer le hash du mot de passe admin
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Mettre a jour le mot de passe admin
    await connection.execute(
        "UPDATE user SET password_hash = ? WHERE email = 'admin@espantsiranana.mg'",
        [hashedPassword]
    );
    
    // Generer des mots de passe simples pour les classes
    const classes = [
        'tci2025', 'stic2025', 'gc2025', 'gm2025', 'ge2025', 
        'he2025', 'get2025', 'tnc2025', 'gmh2025'
    ];
    
    const classeNames = ['L1 TCI', 'L2 STIC', 'L2 GC', 'L2 GM', 'L2 GE', 'L2 HE', 'L2 GET', 'L2 TNC', 'L2 GMH'];
    
    for (let i = 0; i < classeNames.length; i++) {
        const hash = await bcrypt.hash(classes[i], 10);
        await connection.execute(
            "UPDATE classe SET mot_de_passe = ? WHERE nom = ?",
            [hash, classeNames[i]]
        );
    }
    
    console.log('[SUCCES] Base de donnees initialisee avec succes');
    console.log('[ADMIN] Email: admin@espantsiranana.mg');
    console.log('[ADMIN] Mot de passe: admin123');
    console.log('[CLASSES] Mots de passe pour les classes:');
    classeNames.forEach((name, i) => {
        if (classes[i]) console.log('  - ' + name + ' : ' + classes[i]);
    });
    
    await connection.end();
}

initDB().catch(console.error);
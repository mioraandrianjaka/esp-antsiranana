const mysql = require('mysql2/promise');

let pool;

if (process.env.DATABASE_URL) {
    // Utiliser DATABASE_URL si disponible - Ajout du paramètre SSL
    let databaseUrl = process.env.DATABASE_URL;
    // Ajouter SSL si non présent
    if (!databaseUrl.includes('ssl')) {
        databaseUrl += '?ssl={"rejectUnauthorized":true}';
    }
    pool = mysql.createPool({
        uri: databaseUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} else {
    // Sinon utiliser les variables individuelles avec SSL activé
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER || '3gQGF7pziojP8g9.root',
        password: process.env.DB_PASSWORD || 'ABCDEFGH123',
        database: process.env.DB_NAME || 'esp_antsiranana',
        ssl: {
            rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

module.exports = pool;
const mysql = require('mysql2/promise');

let pool;

if (process.env.DATABASE_URL) {
    // Utiliser DATABASE_URL si disponible
    pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} else {
    // Sinon utiliser les variables individuelles
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'ABCDEFGH123',
        database: process.env.DB_NAME || 'esp_antsiranana',
        ssl: {
            rejectUnauthorized: false
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

module.exports = pool;
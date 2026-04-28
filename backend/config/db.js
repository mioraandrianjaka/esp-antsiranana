// backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        // par défaut sur XAMPP
    password: '',        // par défaut sur XAMPP (vide)
    database: 'esp_antsiranana',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
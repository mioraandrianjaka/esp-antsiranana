// backend/config/db.js
const mysql = require('mysql2/promise');
const getDbConfig = require('./db-config');

const dbConfig = getDbConfig();
const baseConfig = dbConfig.uri ? dbConfig.uri : dbConfig;

const pool = mysql.createPool({
    ...baseConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
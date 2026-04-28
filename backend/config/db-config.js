const DEFAULT_DB_PORT = 3306;

function toBool(value, defaultValue = false) {
    if (value === undefined) return defaultValue;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getDbConfig() {
    const {
        DATABASE_URL,
        DB_HOST = 'localhost',
        DB_PORT = DEFAULT_DB_PORT,
        DB_USER = 'root',
        DB_PASSWORD = '',
        DB_NAME = 'esp_antsiranana',
        DB_SSL = 'false',
        DB_SSL_REJECT_UNAUTHORIZED = 'true'
    } = process.env;

    const sslEnabled = toBool(DB_SSL, false);
    const rejectUnauthorized = toBool(DB_SSL_REJECT_UNAUTHORIZED, true);

    const config = DATABASE_URL
        ? { uri: DATABASE_URL }
        : {
            host: DB_HOST,
            port: Number(DB_PORT) || DEFAULT_DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        };

    if (sslEnabled) {
        config.ssl = { rejectUnauthorized };
    }

    return config;
}

module.exports = getDbConfig;

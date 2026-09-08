require('dotenv').config({ quiet: true });

const config = {
    PORT: process.env.PORT || 8004,
    DB_URL: process.env.DB_URL,
    CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8003',
    APP_SECRET: process.env.APP_SECRET
};

config.requireVars = (...names) => {
    const missing = names.filter((name) => !config[name]);

    if (missing.length) {
        console.error(`missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
    }
};

module.exports = config;

require('dotenv').config({ quiet: true });

const config = {
    PORT: process.env.PORT || 8004,
    DB_URL: process.env.DB_URL,
    PRODUCTS_SERVICE_URL: process.env.PRODUCTS_SERVICE_URL,
    APP_SECRET: process.env.APP_SECRET
};

config.requireVars = (...names) => {
    const missing = names.filter((name) => !config[name]);

    if (missing.length > 0) {
        console.error(
            `Missing required environment variables: ${missing.join(', ')}`
        );

        process.exit(1);
    }
};

module.exports = config;

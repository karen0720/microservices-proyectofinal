require('dotenv').config({ quiet: true });

const config = {
    PORT: process.env.PORT || 8004,
    CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8003',
    APP_SECRET: process.env.APP_SECRET || 'dev-secret-change-me'
};

module.exports = config;

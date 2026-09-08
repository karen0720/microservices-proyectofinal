const express = require('express');
const { PORT, requireVars } = require('./src/config');
const { databaseConnection } = require('./src/database');
const expressApp = require('./src/express-app');

const StartServer = async () => {
    requireVars('DB_URL', 'APP_SECRET', 'PRODUCTS_SERVICE_URL');

    const app = express();

    await databaseConnection();
    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`shopping listening on port ${PORT}`);
    }).on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
};

StartServer().catch((err) => {
    console.error(`shopping failed to start: ${err.message}`);
    process.exit(1);
});

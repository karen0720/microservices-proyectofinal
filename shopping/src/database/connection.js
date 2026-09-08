const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Shopping database connected');
    } catch (err) {
        console.error(`Shopping database connection failed: ${err.message}`);
        process.exit(1);
    }
};

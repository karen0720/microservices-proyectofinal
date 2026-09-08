const express = require('express');
const shoppingApi = require('./api');
const { errorHandler } = require('./utils/error-handler');

module.exports = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    shoppingApi(app);

    app.use(errorHandler);
};

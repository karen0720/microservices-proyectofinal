const express = require('express');
const customerApi = require('./api');
const { errorHandler } = require('./utils/error-handler');

module.exports = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    customerApi(app);

    app.use(errorHandler);
};

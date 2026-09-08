jest.mock('express-http-proxy', () => {
    return (baseUrl, options) => {
        return (req, res) => {
            res.status(200).json({
                service: baseUrl,
                path: options.proxyReqPathResolver(req)
            });
        };
    };
});

process.env.CUSTOMERS_URL = 'http://localhost:8003';
process.env.PRODUCTS_URL = 'http://localhost:8002';
process.env.SHOPPING_URL = 'http://localhost:8004';

const express = require('express');
const request = require('supertest');
const expressApp = require('../src/express-app');

describe('Gateway - Products', () => {
    let app;

    beforeAll(async () => {
        app = express();
        await expressApp(app);
    });

    test('GET /products debe dirigir la solicitud al servicio Products', async () => {
        const response = await request(app).get('/products');

        expect(response.statusCode).toBe(200);
        expect(response.body.service).toBe('http://localhost:8002');
        expect(response.body.path).toBe('/products');
    });
});

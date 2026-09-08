const proxy = require('express-http-proxy');
const {
    CUSTOMERS_URL,
    PRODUCTS_URL,
    SHOPPING_URL
} = require('./config');

const composeProfile = require('./compose-profile');
const { APIError } = require('./utils/app-errors');

const proxyErrorHandler = (name) => (err, res, next) => {
    console.error(`${name} unavailable: ${err.message}`);
    next(
        new APIError(
            'ServiceUnavailable',
            503,
            `${name} service unavailable`
        )
    );
};

const forward = (
    name,
    baseUrl,
    pathResolver = (req) => req.originalUrl
) =>
    proxy(baseUrl, {
        proxyReqPathResolver: pathResolver,
        proxyErrorHandler: proxyErrorHandler(name)
    });

module.exports = (app) => {
    // Composición del perfil
    app.get('/customer/profile', composeProfile);

    // Shopping
    app.use(
        '/customer/shopping-details',
        forward(
            'shopping',
            SHOPPING_URL,
            () => '/shopping-details'
        )
    );

    app.use(
        '/customer/wishlist',
        forward(
            'shopping',
            SHOPPING_URL,
            () => '/wishlist'
        )
    );

    app.use(
        '/customer/cart',
        forward(
            'shopping',
            SHOPPING_URL,
            () => '/cart'
        )
    );

    app.use(
        '/customer/order',
        forward(
            'shopping',
            SHOPPING_URL,
            () => '/shopping/order'
        )
    );

    app.use(
        '/wishlist',
        forward('shopping', SHOPPING_URL)
    );

    app.use(
        '/cart',
        forward('shopping', SHOPPING_URL)
    );

    app.use(
        '/shopping',
        forward('shopping', SHOPPING_URL)
    );

    // Customers
    app.use(
        '/customer',
        forward('customers', CUSTOMERS_URL)
    );

    // Products
    app.get(
        '/products',
        forward(
            'products',
            PRODUCTS_URL,
            () => '/products'
        )
    );

    app.get(
        '/:id',
        forward(
            'products',
            PRODUCTS_URL,
            (req) => `/products/${req.params.id}`
        )
    );
};

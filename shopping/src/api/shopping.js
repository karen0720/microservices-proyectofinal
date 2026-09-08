const ShoppingService = require('../services/shopping-service');
const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    const service = new ShoppingService();

    app.get('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetCart(_id);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { product, qty } = req.body;

            const { data } = await service.AddToCart(_id, product, qty);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/cart/:productId', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;

            const { data } = await service.RemoveFromCart(
                _id,
                req.params.productId
            );

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/wishlist', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetWishlist(_id);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/wishlist', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { product } = req.body;

            const { data } = await service.AddToWishlist(_id, product);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/wishlist/:productId', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;

            const { data } = await service.RemoveFromWishlist(
                _id,
                req.params.productId
            );

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/shopping-details', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetShoppingDetails(_id);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/orders', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetOrders(_id);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/shopping/order', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { txnId } = req.body;

            const { data } = await service.PlaceOrder(_id, txnId);

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};

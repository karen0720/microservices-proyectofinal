const ShoppingService = require('../services/shopping-service');

module.exports = (app) => {

    const service = new ShoppingService();

    app.post('/shopping/order', async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    message: 'Missing authorization token'
                });
            }

            const token = authHeader.split(' ')[1];

            const { txnId } = req.body;

            const { data } = await service.PlaceOrder(
                null,
                txnId,
                token
            );

            return res.json(data);

        } catch (err) {
            next(err);
        }
    });
};

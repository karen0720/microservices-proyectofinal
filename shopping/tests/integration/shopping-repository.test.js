const mongoose = require('mongoose');

const {
    CartModel
} = require('../../src/database/models');

const ShoppingRepository = require('../../src/database/repository/shopping-repository');

const TEST_DB_URL =
    process.env.TEST_DB_URL ||
    'mongodb://127.0.0.1:27019/shopping_test';

describe('Shopping - Integración con MongoDB', () => {
    let repository;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URL);
        repository = new ShoppingRepository();
    });

    afterEach(async () => {
        await CartModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    test('debe guardar y recuperar un carrito desde MongoDB', async () => {
        const customerId = 'integration-customer-001';

        const product = {
            _id: 'product-001',
            name: 'Auto de prueba',
            price: 20000,
            type: 'sedan',
            available: true
        };

        await repository.AddToCart(
            customerId,
            product,
            2
        );

        const cart = await repository.GetCart(customerId);

        expect(cart).toHaveLength(1);
        expect(cart[0].product._id).toBe('product-001');
        expect(cart[0].product.name).toBe('Auto de prueba');
        expect(cart[0].unit).toBe(2);
    });
});

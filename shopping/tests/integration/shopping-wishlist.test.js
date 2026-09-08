const mongoose = require('mongoose');

const {
    WishlistModel
} = require('../../src/database/models');

const ShoppingRepository =
    require('../../src/database/repository/shopping-repository');

const TEST_DB_URL =
    process.env.TEST_DB_URL ||
    'mongodb://127.0.0.1:27019/shopping_test';

describe('Shopping - Integración de Wishlist con MongoDB', () => {
    let repository;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URL);
        repository = new ShoppingRepository();
    });

    afterEach(async () => {
        await WishlistModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    test('debe guardar y recuperar una wishlist desde MongoDB', async () => {
        const customerId = 'integration-customer-wishlist';

        const product = {
            _id: 'product-wishlist-001',
            name: 'Auto deportivo',
            price: 45000,
            type: 'sport',
            available: true
        };

        await repository.AddToWishlist(
            customerId,
            product
        );

        const wishlist =
            await repository.GetWishlist(customerId);

        expect(wishlist).toHaveLength(1);
        expect(wishlist[0]._id).toBe('product-wishlist-001');
        expect(wishlist[0].name).toBe('Auto deportivo');
        expect(wishlist[0].price).toBe(45000);
    });
});

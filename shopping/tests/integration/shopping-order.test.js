const mongoose = require('mongoose');

const {
    CartModel,
    OrderModel
} = require('../../src/database/models');

const ShoppingRepository =
    require('../../src/database/repository/shopping-repository');

const TEST_DB_URL =
    process.env.TEST_DB_URL ||
    'mongodb://127.0.0.1:27019/shopping_test';

describe('Shopping - Integración de Orders con MongoDB', () => {
    let repository;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URL);
        repository = new ShoppingRepository();
    });

    afterEach(async () => {
        await CartModel.deleteMany({});
        await OrderModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    test('debe guardar la orden y vaciar el carrito', async () => {
        const customerId = 'integration-customer-order';

        const cart = [
            {
                product: {
                    _id: 'product-order-001',
                    name: 'Auto ejecutivo',
                    price: 25000,
                    type: 'sedan',
                    available: true
                },
                unit: 2
            }
        ];

        await CartModel.create({
            customerId,
            items: cart
        });

        const order = {
            amount: 50000,
            txnId: 'txn-integration-001',
            status: 'received',
            items: cart,
            date: new Date()
        };

        const savedOrder = await repository.PlaceOrder(
            customerId,
            order
        );

        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.customerId).toBe(customerId);
        expect(savedOrder.amount).toBe(50000);
        expect(savedOrder.txnId).toBe('txn-integration-001');
        expect(savedOrder.status).toBe('received');

        const orderInDatabase =
            await OrderModel.findOne({
                _id: savedOrder._id
            });

        expect(orderInDatabase).not.toBeNull();
        expect(orderInDatabase.customerId).toBe(customerId);
        expect(orderInDatabase.amount).toBe(50000);
        expect(orderInDatabase.txnId).toBe('txn-integration-001');

        const cartAfterOrder =
            await repository.GetCart(customerId);

        expect(cartAfterOrder).toEqual([]);
    });
});

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('mongoose', () => ({
    Types: {
        ObjectId: jest.fn(() => ({
            toString: () => 'order-123'
        }))
    }
}));

const ShoppingService = require('../src/services/shopping-service');

describe('Shopping - PlaceOrder exitoso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe calcular el total y enviar la orden al servicio Customers', async () => {
        const cart = [
            {
                product: {
                    _id: 'product-1',
                    name: 'Auto Toyota',
                    price: 100
                },
                unit: 2
            },
            {
                product: {
                    _id: 'product-2',
                    name: 'Auto Mazda',
                    price: 50
                },
                unit: 1
            }
        ];

        const savedOrder = {
            _id: 'order-123',
            amount: 250,
            txnId: 'txn-123',
            status: 'received',
            items: cart
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => cart
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => savedOrder
            });

        const service = new ShoppingService();

        const result = await service.PlaceOrder(
            'customer-123',
            'txn-123',
            'token-123'
        );

        expect(mockFetch).toHaveBeenCalledTimes(2);

        expect(mockFetch).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('/customer/cart'),
            expect.objectContaining({
                method: 'GET'
            })
        );

        expect(mockFetch).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('/customer/order'),
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token-123'
                }
            })
        );

        const secondCallOptions = mockFetch.mock.calls[1][1];
        const sentBody = JSON.parse(secondCallOptions.body);

        expect(sentBody.order._id).toBe('order-123');
        expect(sentBody.order.amount).toBe(250);
        expect(sentBody.order.txnId).toBe('txn-123');
        expect(sentBody.order.status).toBe('received');
        expect(sentBody.order.items).toEqual(cart);

        expect(result).toEqual({
            data: savedOrder
        });
    });
});

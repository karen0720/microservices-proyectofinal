const mockFetch = jest.fn();
global.fetch = mockFetch;

const ShoppingService = require('../src/services/shopping-service');

describe('Shopping - Error del servicio Customers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe lanzar error cuando Customers rechaza la orden', async () => {
        const cart = [
            {
                product: {
                    _id: 'product-1',
                    name: 'Auto Toyota',
                    price: 100
                },
                unit: 1
            }
        ];

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => cart
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    message: 'Customer not found'
                })
            });

        const service = new ShoppingService();

        await expect(
            service.PlaceOrder('customer-123', 'txn-123', 'token-123')
        ).rejects.toMatchObject({
            name: 'CustomerServiceError',
            statusCode: 400,
            message: 'Customer not found'
        });

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});

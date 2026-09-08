const mockFetch = jest.fn();
global.fetch = mockFetch;

const ShoppingService = require('../src/services/shopping-service');

describe('Shopping - PlaceOrder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe rechazar la orden cuando el carrito está vacío', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        const service = new ShoppingService();

        await expect(
            service.PlaceOrder('customer-123', 'txn-123', 'token-123')
        ).rejects.toMatchObject({
            message: 'Cart is empty'
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/customer/cart'),
            expect.objectContaining({
                method: 'GET',
                headers: {
                    Authorization: 'Bearer token-123'
                }
            })
        );
    });
});

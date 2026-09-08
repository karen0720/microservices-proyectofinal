jest.mock('../src/database', () => {
    const mockRepository = {
        GetCart: jest.fn()
    };

    return {
        ShoppingRepository: jest.fn(() => mockRepository),
        __mockRepository: mockRepository
    };
});

const ShoppingService = require('../src/services/shopping-service');
const { __mockRepository } = require('../src/database');

describe('Shopping - PlaceOrder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe rechazar la orden cuando el carrito está vacío', async () => {
        __mockRepository.GetCart.mockResolvedValue([]);

        const service = new ShoppingService();

        await expect(
            service.PlaceOrder('customer-123', 'txn-123')
        ).rejects.toMatchObject({
            message: 'Cart is empty'
        });

        expect(__mockRepository.GetCart).toHaveBeenCalledWith(
            'customer-123'
        );
    });
});

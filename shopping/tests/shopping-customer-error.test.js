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

describe('Shopping - Error del repository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe propagar el error cuando falla el repository', async () => {
        __mockRepository.GetCart.mockRejectedValue(
            new Error('Database error')
        );

        const service = new ShoppingService();

        await expect(
            service.PlaceOrder('customer-123', 'txn-123')
        ).rejects.toMatchObject({
            name: 'PlaceOrderError',
            statusCode: 500,
            message: 'Database error'
        });

        expect(__mockRepository.GetCart).toHaveBeenCalledWith(
            'customer-123'
        );
    });
});

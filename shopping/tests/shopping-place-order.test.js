jest.mock('../src/database', () => {
    const mockRepository = {
        GetCart: jest.fn(),
        PlaceOrder: jest.fn()
    };

    return {
        ShoppingRepository: jest.fn(() => mockRepository),
        __mockRepository: mockRepository
    };
});

const ShoppingService = require('../src/services/shopping-service');
const { __mockRepository } = require('../src/database');

describe('Shopping - PlaceOrder exitoso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe calcular el total y guardar la orden mediante el repository', async () => {
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
            customerId: 'customer-123',
            amount: 250,
            txnId: 'txn-123',
            status: 'received',
            items: cart
        };

        __mockRepository.GetCart.mockResolvedValue(cart);
        __mockRepository.PlaceOrder.mockResolvedValue(savedOrder);

        const service = new ShoppingService();

        const result = await service.PlaceOrder(
            'customer-123',
            'txn-123'
        );

        expect(__mockRepository.GetCart).toHaveBeenCalledWith(
            'customer-123'
        );

        expect(__mockRepository.PlaceOrder).toHaveBeenCalledWith(
            'customer-123',
            expect.objectContaining({
                customerId: 'customer-123',
                amount: 250,
                txnId: 'txn-123',
                status: 'received',
                items: cart
            })
        );

        expect(result).toEqual({
            data: savedOrder
        });
    });
});

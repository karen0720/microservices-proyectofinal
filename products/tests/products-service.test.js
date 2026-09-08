jest.mock('../src/database', () => {
    const mockRepository = {
        FindAll: jest.fn(),
        FindById: jest.fn()
    };

    return {
        ProductRepository: jest.fn(() => mockRepository),
        __mockRepository: mockRepository
    };
});

jest.mock('../src/utils', () => ({
    FormateData: jest.fn((data) => ({ data }))
}));

const ProductsService = require('../src/services/products-service');
const { __mockRepository } = require('../src/database');

describe('Products - GetProducts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe obtener productos y categorías correctamente', async () => {
        const products = [
            { _id: '1', name: 'Sedan', type: 'sedan' },
            { _id: '2', name: 'SUV', type: 'suv' },
            { _id: '3', name: 'Otro Sedan', type: 'sedan' }
        ];

        __mockRepository.FindAll.mockResolvedValue(products);

        const service = new ProductsService();

        const result = await service.GetProducts();

        expect(__mockRepository.FindAll).toHaveBeenCalled();

        expect(result).toEqual({
            data: {
                products,
                categories: ['sedan', 'suv']
            }
        });
    });
});

describe('Products - GetProductById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe obtener un producto por su id', async () => {
        const product = {
            _id: 'product-123',
            name: 'Sedan Clásico',
            type: 'sedan',
            price: 18000
        };

        __mockRepository.FindById.mockResolvedValue(product);

        const service = new ProductsService();

        const result = await service.GetProductById('product-123');

        expect(__mockRepository.FindById).toHaveBeenCalledWith(
            'product-123'
        );

        expect(result).toEqual({
            data: product
        });
    });
});

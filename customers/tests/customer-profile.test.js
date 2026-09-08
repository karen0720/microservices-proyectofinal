jest.mock('../src/database', () => {
    const mockRepository = {
        GetProfile: jest.fn()
    };

    return {
        CustomerRepository: jest.fn(() => mockRepository),
        __mockRepository: mockRepository
    };
});

jest.mock('../src/utils', () => ({
    GenerateSalt: jest.fn(),
    GeneratePassword: jest.fn(),
    GenerateSignature: jest.fn(),
    ValidatePassword: jest.fn(),
    FormateData: jest.fn((data) => ({ data }))
}));

const CustomerService = require('../src/services/customer-service');
const { __mockRepository } = require('../src/database');

describe('Customers - GetProfile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe obtener el perfil de un cliente correctamente', async () => {
        const profile = {
            _id: 'customer-123',
            email: 'karen@test.com',
            phone: '3001234567',
            address: []
        };

        __mockRepository.GetProfile.mockResolvedValue(profile);

        const service = new CustomerService();

        const result = await service.GetProfile({
            _id: 'customer-123'
        });

        expect(__mockRepository.GetProfile).toHaveBeenCalledWith(
            'customer-123'
        );

        expect(result).toEqual({
            data: profile
        });
    });
});

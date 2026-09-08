jest.mock('../src/database', () => {
    const mockRepository = {
        CreateCustomer: jest.fn()
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
const {
    GenerateSalt,
    GeneratePassword,
    GenerateSignature
} = require('../src/utils');

describe('Customers - SignUp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe registrar un cliente y devolver id y token', async () => {
        const customer = {
            _id: 'customer-123',
            email: 'karen@test.com'
        };

        GenerateSalt.mockResolvedValue('salt123');
        GeneratePassword.mockResolvedValue('hashed-password');
        GenerateSignature.mockResolvedValue('token123');

        __mockRepository.CreateCustomer.mockResolvedValue(customer);

        const service = new CustomerService();

        const result = await service.SignUp({
            email: 'karen@test.com',
            password: '123456',
            phone: '3001234567'
        });

        expect(__mockRepository.CreateCustomer).toHaveBeenCalledWith({
            email: 'karen@test.com',
            password: 'hashed-password',
            phone: '3001234567',
            salt: 'salt123'
        });

        expect(GenerateSignature).toHaveBeenCalledWith({
            email: 'karen@test.com',
            _id: 'customer-123'
        });

        expect(result).toEqual({
            data: {
                id: 'customer-123',
                token: 'token123'
            }
        });
    });
});

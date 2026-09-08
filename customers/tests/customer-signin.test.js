jest.mock('../src/database', () => {
    const mockRepository = {
        FindCustomer: jest.fn()
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
    ValidatePassword,
    GenerateSignature
} = require('../src/utils');

describe('Customers - SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe iniciar sesión con credenciales válidas y devolver token', async () => {
        const customer = {
            _id: 'customer-123',
            email: 'karen@test.com',
            password: 'hashed-password',
            salt: 'salt123'
        };

        __mockRepository.FindCustomer.mockResolvedValue(customer);
        ValidatePassword.mockResolvedValue(true);
        GenerateSignature.mockResolvedValue('token123');

        const service = new CustomerService();

        const result = await service.SignIn({
            email: 'karen@test.com',
            password: '123456'
        });

        expect(__mockRepository.FindCustomer).toHaveBeenCalledWith({
            email: 'karen@test.com'
        });

        expect(ValidatePassword).toHaveBeenCalledWith(
            '123456',
            'hashed-password',
            'salt123'
        );

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

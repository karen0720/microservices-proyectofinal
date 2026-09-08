const {
    CustomerRepository
} = require('../database');

const {
    FormateData,
    GenerateSalt,
    GeneratePassword,
    GenerateSignature,
    ValidatePassword
} = require('../utils');

const {
    APIError,
    BadRequestError,
    NotFoundError,
    ValidationError
} = require('../utils/app-errors');

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs) {
        try {
            const { email, password } = userInputs;

            const existingCustomer =
                await this.repository.FindCustomer({ email });

            if (!existingCustomer) {
                throw new NotFoundError(
                    'Customer not found'
                );
            }

            const validPassword = await ValidatePassword(
                password,
                existingCustomer.password,
                existingCustomer.salt
            );

            if (!validPassword) {
                throw new BadRequestError(
                    'Invalid password'
                );
            }

            const token = await GenerateSignature({
                email: existingCustomer.email,
                _id: existingCustomer._id
            });

            return FormateData({
                id: existingCustomer._id,
                token
            });
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'SignInError',
                500,
                err.message
            );
        }
    }

    async SignUp(userInputs) {
        try {
            const { email, password, phone } = userInputs;

            const salt = await GenerateSalt();

            const hashedPassword =
                await GeneratePassword(
                    password,
                    salt
                );

            const customer =
                await this.repository.CreateCustomer({
                    email,
                    password: hashedPassword,
                    phone,
                    salt
                });

            const token = await GenerateSignature({
                email: customer.email,
                _id: customer._id
            });

            return FormateData({
                id: customer._id,
                token
            });
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'SignUpError',
                500,
                err.message
            );
        }
    }

    async AddNewAddress(customerId, address) {
        try {
            if (!address) {
                throw new ValidationError(
                    'Address is required'
                );
            }

            const savedAddress =
                await this.repository.AddNewAddress(
                    customerId,
                    address
                );

            return FormateData(savedAddress);
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'AddAddressError',
                500,
                err.message
            );
        }
    }

    async GetProfile(customerId) {
        try {
            const id =
                typeof customerId === 'object'
                    ? customerId._id
                    : customerId;

            const profile =
                await this.repository.GetProfile(id);

            if (!profile) {
                throw new NotFoundError(
                    'Customer not found'
                );
            }

            return FormateData(profile);
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'GetProfileError',
                500,
                err.message
            );
        }
    }
}

module.exports = CustomerService;

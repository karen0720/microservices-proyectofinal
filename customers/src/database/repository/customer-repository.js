const { CustomerModel, AddressModel } = require('../models');
const { APIError, BadRequestError } = require('../../utils/app-errors');

class CustomerRepository {
    async CreateCustomer({ email, password, phone, salt }) {
        try {
            return await CustomerModel.create({
                email,
                password,
                salt,
                phone
            });
        } catch (err) {
            if (err.code === 11000) {
                throw new BadRequestError(
                    'Email already registered'
                );
            }

            throw new APIError(
                'CreateCustomerError',
                500,
                err.message
            );
        }
    }

    async FindCustomer({ email }) {
        return CustomerModel.findOne({ email });
    }

    async AddNewAddress(
        customerId,
        { street, postalCode, city, country }
    ) {
        const customer =
            await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError(
                'Customer not found'
            );
        }

        const address = await AddressModel.create({
            street,
            postalCode,
            city,
            country
        });

        customer.address.push(address._id);

        await customer.save();

        return address;
    }

    async GetProfile(customerId) {
        return CustomerModel
            .findById(customerId)
            .populate('address');
    }
}

module.exports = CustomerRepository;

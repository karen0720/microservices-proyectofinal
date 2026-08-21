const mongoose = require('mongoose');
const CustomerService = require('./customer-service');
const { FormateData } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class ShoppingService {
    constructor() {
        // Shopping never touches customer-repository/CustomerModel directly —
        // it goes through the customer domain's public service, same rule as products.js.
        this.customerService = new CustomerService();
    }

    async PlaceOrder(customerId, txnId) {
        try {
            const { data: cart } = await this.customerService.GetCart(customerId);

            if (!cart || cart.length === 0) {
                throw new BadRequestError('Cart is empty');
            }

            const amount = cart.reduce((total, item) => total + item.product.price * item.unit, 0);

            const order = {
                _id: new mongoose.Types.ObjectId().toString(),
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: new Date(),
            };

            const { data } = await this.customerService.PlaceOrder(customerId, order);
            return FormateData(data);
        } catch (err) {
            if (err instanceof APIError) throw err;
            throw new APIError('PlaceOrderError', 500, err.message);
        }
    }
}

module.exports = ShoppingService;

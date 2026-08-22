const mongoose = require('mongoose');
const { FormateData } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

const CUSTOMER_SERVICE_URL =
    process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8003';

class ShoppingService {

    async PlaceOrder(customerId, txnId, token) {
        try {
            // Obtener el carrito del cliente
            const cartResponse = await fetch(
                `${CUSTOMER_SERVICE_URL}/customer/cart`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const cartResult = await cartResponse.json();

            if (!cartResponse.ok) {
                throw new APIError(
                    'CustomerServiceError',
                    cartResponse.status,
                    cartResult.message || 'Error getting customer cart'
                );
            }

            const cart = cartResult;

            if (!cart || cart.length === 0) {
                throw new BadRequestError('Cart is empty');
            }

            // Calcular el valor total
            const amount = cart.reduce(
                (total, item) =>
                    total + item.product.price * item.unit,
                0
            );

            // Crear la orden
            const order = {
                _id: new mongoose.Types.ObjectId().toString(),
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: new Date(),
            };

            // Guardar la orden en Customers
            const orderResponse = await fetch(
                `${CUSTOMER_SERVICE_URL}/customer/order`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ order }),
                }
            );

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new APIError(
                    'CustomerServiceError',
                    orderResponse.status,
                    orderResult.message || 'Error placing order'
                );
            }

            return FormateData(orderResult);

        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'PlaceOrderError',
                500,
                err.message
            );
        }
    }
}

module.exports = ShoppingService;

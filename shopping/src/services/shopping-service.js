const mongoose = require('mongoose');
const { ShoppingRepository } = require('../database');
const { FormateData } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository();
    }

    async GetCart(customerId) {
        try {
            const cart = await this.repository.GetCart(customerId);
            return FormateData(cart);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'GetCartError',
                500,
                err.message
            );
        }
    }

    async AddToCart(customerId, product, qty) {
        try {
            if (!product || qty === undefined) {
                throw new BadRequestError(
                    'Product and quantity are required'
                );
            }

            const cart = await this.repository.AddToCart(
                customerId,
                product,
                qty
            );

            return FormateData(cart);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'AddToCartError',
                500,
                err.message
            );
        }
    }

    async RemoveFromCart(customerId, productId) {
        try {
            const cart = await this.repository.RemoveFromCart(
                customerId,
                productId
            );

            return FormateData(cart);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'RemoveFromCartError',
                500,
                err.message
            );
        }
    }

    async GetWishlist(customerId) {
        try {
            const wishlist = await this.repository.GetWishlist(
                customerId
            );

            return FormateData(wishlist);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'GetWishlistError',
                500,
                err.message
            );
        }
    }

    async AddToWishlist(customerId, product) {
        try {
            if (!product) {
                throw new BadRequestError(
                    'Product is required'
                );
            }

            const wishlist = await this.repository.AddToWishlist(
                customerId,
                product
            );

            return FormateData(wishlist);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'AddToWishlistError',
                500,
                err.message
            );
        }
    }

    async RemoveFromWishlist(customerId, productId) {
        try {
            const wishlist =
                await this.repository.RemoveFromWishlist(
                    customerId,
                    productId
                );

            return FormateData(wishlist);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'RemoveFromWishlistError',
                500,
                err.message
            );
        }
    }

    async GetShoppingDetails(customerId) {
        try {
            const [cart, wishlist, orders] = await Promise.all([
                this.repository.GetCart(customerId),
                this.repository.GetWishlist(customerId),
                this.repository.GetOrders(customerId)
            ]);

            return FormateData({
                cart,
                wishlist,
                orders
            });
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'GetShoppingDetailsError',
                500,
                err.message
            );
        }
    }

    async GetOrders(customerId) {
        try {
            const orders = await this.repository.GetOrders(
                customerId
            );

            return FormateData(orders);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'GetOrdersError',
                500,
                err.message
            );
        }
    }

    async PlaceOrder(customerId, txnId) {
        try {
            const cart = await this.repository.GetCart(customerId);

            if (!cart || cart.length === 0) {
                throw new BadRequestError('Cart is empty');
            }

            const amount = cart.reduce(
                (total, item) =>
                    total + item.product.price * item.unit,
                0
            );

            const order = {
                _id: new mongoose.Types.ObjectId().toString(),
                customerId,
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: new Date()
            };

            const savedOrder =
                await this.repository.PlaceOrder(
                    customerId,
                    order
                );

            return FormateData(savedOrder);
        } catch (err) {
            if (err instanceof APIError) throw err;

            throw new APIError(
                'PlaceOrderError',
                500,
                err.message
            );
        }
    }
}

module.exports = ShoppingService;

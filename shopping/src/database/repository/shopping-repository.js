const {
    CartModel,
    WishlistModel,
    OrderModel
} = require('../models');

const { BadRequestError } = require('../../utils/app-errors');

class ShoppingRepository {

    async GetCart(customerId) {
        const cart = await CartModel.findOne({ customerId });

        if (!cart) {
            return [];
        }

        return cart.items;
    }

    async AddToCart(customerId, product, qty) {
        let cart = await CartModel.findOne({ customerId });

        if (!cart) {
            cart = await CartModel.create({
                customerId,
                items: [
                    {
                        product,
                        unit: qty
                    }
                ]
            });

            return cart.items;
        }

        const productId = product._id.toString();

        const existingItem = cart.items.find(
            (item) => item.product._id === productId
        );

        if (existingItem) {
            existingItem.unit = qty;
        } else {
            cart.items.push({
                product,
                unit: qty
            });
        }

        await cart.save();

        return cart.items;
    }

    async RemoveFromCart(customerId, productId) {
        const cart = await CartModel.findOne({ customerId });

        if (!cart) {
            return [];
        }

        cart.items = cart.items.filter(
            (item) => item.product._id !== productId
        );

        await cart.save();

        return cart.items;
    }

    async GetWishlist(customerId) {
        const wishlist = await WishlistModel.findOne({ customerId });

        if (!wishlist) {
            return [];
        }

        return wishlist.items;
    }

    async AddToWishlist(customerId, product) {
        let wishlist = await WishlistModel.findOne({ customerId });

        if (!wishlist) {
            wishlist = await WishlistModel.create({
                customerId,
                items: [product]
            });

            return wishlist.items;
        }

        const productId = product._id.toString();

        const exists = wishlist.items.some(
            (item) => item._id === productId
        );

        if (!exists) {
            wishlist.items.push({
                ...product,
                _id: productId
            });

            await wishlist.save();
        }

        return wishlist.items;
    }

    async RemoveFromWishlist(customerId, productId) {
        const wishlist = await WishlistModel.findOne({ customerId });

        if (!wishlist) {
            return [];
        }

        wishlist.items = wishlist.items.filter(
            (item) => item._id !== productId
        );

        await wishlist.save();

        return wishlist.items;
    }

    async PlaceOrder(customerId, order) {
        const savedOrder = await OrderModel.create({
            customerId,
            amount: order.amount,
            txnId: order.txnId,
            status: order.status,
            items: order.items,
            date: order.date
        });

        await CartModel.findOneAndUpdate(
            { customerId },
            { $set: { items: [] } }
        );

        return savedOrder;
    }

    async GetOrders(customerId) {
        return OrderModel.find({ customerId }).sort({ date: -1 });
    }
}

module.exports = ShoppingRepository;

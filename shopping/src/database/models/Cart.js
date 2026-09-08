const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSnapshotSchema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        name: String,
        desc: String,
        type: String,
        banner: String,
        price: Number,
        available: Boolean
    },
    {
        _id: false
    }
);

const CartItemSchema = new Schema(
    {
        product: {
            type: ProductSnapshotSchema,
            required: true
        },
        unit: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: true
    }
);

const CartSchema = new Schema(
    {
        customerId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        items: {
            type: [CartItemSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('cart', CartSchema);

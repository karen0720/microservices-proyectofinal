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

const WishlistSchema = new Schema(
    {
        customerId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        items: {
            type: [ProductSnapshotSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('wishlist', WishlistSchema);

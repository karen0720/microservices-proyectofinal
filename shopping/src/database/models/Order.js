const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        customerId: {
            type: String,
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true
        },
        txnId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'received'
        },
        items: [
            {
                product: {
                    type: Schema.Types.Mixed,
                    required: true
                },
                unit: {
                    type: Number,
                    required: true
                }
            }
        ],
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('order', OrderSchema);

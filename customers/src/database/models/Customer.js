const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password: String,
        salt: String,
        phone: String,
        address: [
            {
                type: Schema.Types.ObjectId,
                ref: 'address',
                required: true
            }
        ]
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
            }
        },
        timestamps: true
    }
);

module.exports = mongoose.model(
    'customer',
    CustomerSchema
);

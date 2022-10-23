const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfo = mongoose.createConnection(process.env.infoServer);

const orderDetails = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    count: {
        type: Number,
    },
},
{ timestamps: true },
);

const order = new Schema({
    _id: mongoose.Types.ObjectId,
    storeID: {
        type: String,
        required: true
    },
    leaderEmail: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    didPay: {
        type: Boolean,
        default: false
    },
    orders: [{
        type: orderDetails,
        default: [],
        _id: false
    }]
},
{ timestamps: false }
);

module.exports = connectionInfo.model('order', order);
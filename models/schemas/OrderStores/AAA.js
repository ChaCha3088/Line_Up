const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionOrder = mongoose.createConnection(process.env.orderServer);

const AAA = new Schema({
    storeID: String,
    ID: String,
    Pay: Number,
    orders: {
        String
    }
});

module.exports = connectionOrder.model('AAA', AAA);
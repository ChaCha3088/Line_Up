const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionOrder = mongoose.createConnection(process.env.orderServer);

const 날터 = new Schema({
    storeID: String,
    ID: String,
    Pay: Number,
    orders: {
        String
    }
});

module.exports = connectionOrder.model('날터', 날터);
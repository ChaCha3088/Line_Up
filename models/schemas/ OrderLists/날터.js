const mongoose = require('mongoose');
const { Schema } = mongoose;
const 날터 = new Schema({
    storeID: String,
    ID: String,
    Pay: Number,
    orders: {
        String
    }
});

module.exports = mongoose.model('날터', 날터);
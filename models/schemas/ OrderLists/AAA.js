const mongoose = require('mongoose');
const { Schema } = mongoose;
const AAA = new Schema({
    storeID: String,
    ID: String,
    Pay: Number,
    orders: {
        String
    }
});

module.exports = mongoose.model('AAA', AAA);
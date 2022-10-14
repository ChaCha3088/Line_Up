const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

const AAA = new Schema({
    type: String,
    menu: {
        someMenu: Number,
    },
});

AAA.set('collection', 'AAA');

module.exports = connectionInfoStores.model('AAA', AAA);
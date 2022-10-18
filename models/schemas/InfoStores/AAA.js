const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfoStores = mongoose.createConnection(process.env.infoServer);

const AAA = new Schema({
    type: String,
    menu: {
        someMenu: Number,
    },
});

AAA.set('collection', 'AAA');

module.exports = connectionInfoStores.model('AAA', AAA);
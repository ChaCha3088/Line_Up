const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfo = mongoose.createConnection(process.env.infoServer);

const storeInfo = new Schema({
    _id: mongoose.Types.ObjectId,
    storeID: {
        type: String,
        required: true
    },
    menu: {
        type: Object,
        required: true
    },
    maxTable: {
        type: Number,
        required: true
    },
    tableLists: [{
        type: mongoose.Types.ObjectId,
        ref: 'order',
    }],
});

module.exports = connectionInfo.model('storeInfo', storeInfo);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

const nal = new Schema({
    킬바사소세지: Number,
    콘치즈: Number,
    참이슬: Number,
});

nal.set('collection', 'nal');

module.exports = connectionInfoStores.model('nal', nal);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

const AAA = new Schema({
    킬바사소세지: Number,
    콘치즈: Number,
    참이슬: Number,
});

AAA.set('collection', 'AAA');

module.exports = connectionInfoStores.model('AAA', AAA);
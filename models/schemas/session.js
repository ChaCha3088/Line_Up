const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');

const { Schema } = mongoose;
const session = new Schema({
    _id: String,
    expires: Date,
    session: String,
});

module.exports = connectionAuth.model('session', session);
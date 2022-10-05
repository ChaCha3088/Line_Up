const mongoose = require('mongoose');
const { Schema } = mongoose;
const session = new Schema({
    _id: String,
    expires: Date,
    session: String,
});

module.exports = mongoose.model('session', session);
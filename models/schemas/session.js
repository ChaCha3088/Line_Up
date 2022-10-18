const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection(process.env.authServer);

const { Schema } = mongoose;
const session = new Schema({
    _id: String,
    expires: Date,
    session: Object,
});

module.exports = connectionAuth.model('session', session);
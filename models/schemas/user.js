const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');

const { Schema } = mongoose;
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: String,
    hash: String,
    admin: String,
}, {
        timestamps: true,
});

module.exports = connectionAuth.model('UserSchema', UserSchema);
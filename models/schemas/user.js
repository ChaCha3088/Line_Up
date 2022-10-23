const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection(process.env.authServer);

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
    salt: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
    },
    tableNumber: Number,
}, {
        timestamps: true,
});

module.exports = connectionAuth.model('UserSchema', UserSchema);
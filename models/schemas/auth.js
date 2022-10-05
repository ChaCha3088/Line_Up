const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    ID: String,
    userName: String,
    accessToken: String,
    admin: String,
}, {
        timestamps: true,
});

module.exports = mongoose.model('UserSchema', UserSchema);
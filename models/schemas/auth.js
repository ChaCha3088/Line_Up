const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');

const { Schema } = mongoose;
const UserSchema = new Schema({
    ID: String,
    userName: String,
    kakaoAccessToken: String,
    admin: String,
}, {
        timestamps: true,
});

module.exports = connectionAuth.model('UserSchema', UserSchema);
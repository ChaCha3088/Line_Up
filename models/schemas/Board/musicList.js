const mongoose = require('mongoose');
const { Schema } = mongoose;
const musicList = new Schema({
    storeID: String,
    ID: String,
    artist: String,
    title: String,
    heart: {
        ID: String,
    },
    timestamps: {
        createdAt: 'createdAt'
    }
});

module.exports = mongoose.model('musicList', musicList);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const musicList = new Schema({
    storeID: {
        type: String,
        required: true
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    heart: {
        email: String,
    },
},
{ timestamps: true },
);

module.exports = mongoose.model('musicList', musicList);
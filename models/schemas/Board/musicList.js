const mongoose = require('mongoose');
const connectionBoards = mongoose.createConnection(process.env.boardServer);
const { Schema } = mongoose;
const musicList = new Schema({
    storeID: {
        type: String,
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
        type: Array,
    },
},
{ timestamps: true },
);

module.exports = connectionBoards.model('musicList', musicList);
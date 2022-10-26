const mongoose = require('mongoose');
const connectionBoards = mongoose.createConnection(process.env.boardServer);
const { Schema } = mongoose;

const musicListTitle = new Schema({
    title: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

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
        type: musicListTitle,
        default: {},
        required: true
    },
    heart: {
        type: Array,
    },
});

module.exports = connectionBoards.model('musicList', musicList);
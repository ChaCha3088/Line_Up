const mongoose = require('mongoose');
const { Schema } = mongoose;
const freeBoard = new Schema({
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    ID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoardComment',
    },
    heart: {
        ID: String,
    },
},
{ timestamps: true },
);

module.exports = mongoose.model('freeBoard', freeBoard);
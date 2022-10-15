const mongoose = require('mongoose');
const { Schema } = mongoose;
const freeBoardComment = new Schema({
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoard',
    },
    commentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ID: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    recomments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoardReComment',
    },
    heart: {
        ID: String,
    },
},
{ timestamps: true },
);

module.exports = mongoose.model('freeBoardComment', freeBoardComment);
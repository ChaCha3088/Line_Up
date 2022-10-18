const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection('mongodb://localhost:27017/Boards');

const freeBoardComment = new Schema({
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoard',
    },
    email: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    isDeleted: Boolean,
    recomments: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardReComment',
    },
    heart: {
        type: Array
    },
},
{ timestamps: true },
);

module.exports = connectionBoards.model('freeBoardComment', freeBoardComment);
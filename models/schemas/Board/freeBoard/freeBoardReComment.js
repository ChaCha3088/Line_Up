const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection('mongodb://localhost:27017/Boards');

const freeBoardReComment = new Schema({
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoard',
    },
    commentID: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardComment',
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
    heart: {
        email: String,
    },
},
{ timestamps: true },
);

module.exports = connectionBoards.model('freeBoardReComment', freeBoardReComment);
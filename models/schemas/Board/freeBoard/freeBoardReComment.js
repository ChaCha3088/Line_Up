const mongoose = require('mongoose');
const connectionBoards = mongoose.createConnection(process.env.boardServer);
const { Schema } = mongoose;

const freeBoardReCommentContents = new Schema({
    contents: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);



const freeBoardReComment = new Schema({
    _id: mongoose.Types.ObjectId,
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: mongoose.Types.ObjectId,
        ref: 'FreeBoard',
    },
    commentID: {
        type: mongoose.Types.ObjectId,
        ref: 'FreeBoardComment',
    },
    email: {
        type: String,
        required: true,
    },
    contents: {
        type: freeBoardReCommentContents,
        default: {}
    },
    heart: {
        type: Array,
    },
},
);

module.exports = connectionBoards.model('FreeBoardReComment', freeBoardReComment);
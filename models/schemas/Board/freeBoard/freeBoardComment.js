const mongoose = require('mongoose');
const connectionBoards = mongoose.createConnection(process.env.boardServer);
const { Schema } = mongoose;

const freeBoardCommentContents = new Schema({
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



const freeBoardComment = new Schema({
    _id: mongoose.Types.ObjectId,
    storeID: {
        type: String,
        required: true,
    },
    postID: {
        type: mongoose.Types.ObjectId,
        ref: 'FreeBoard',
    },
    email: {
        type: String,
        required: true,
    },
    contents: {
        type: freeBoardCommentContents,
        default: {}
    },
    recomments: [{
        type: mongoose.Types.ObjectId,
        ref: 'FreeBoardReComment',
    }],
    heart: {
        type: Array,
    },
},
);

module.exports = connectionBoards.model('FreeBoardComment', freeBoardComment);
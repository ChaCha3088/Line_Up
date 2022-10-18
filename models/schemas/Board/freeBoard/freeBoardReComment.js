const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection(process.env.boardServer);

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
    storeID: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoard',
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardComment',
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

module.exports = connectionBoards.model('freeBoardReComment', freeBoardReComment);
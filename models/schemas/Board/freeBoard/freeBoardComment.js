const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection(process.env.boardServer);

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
    storeID: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoard',
    },
    email: {
        type: String,
        required: true,
    },
    contents: {
        type: freeBoardCommentContents,
        default: {}
    },
    recomments: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardReComment',
    },
    heart: {
        type: Array,
    },
},
);

module.exports = connectionBoards.model('freeBoardComment', freeBoardComment);
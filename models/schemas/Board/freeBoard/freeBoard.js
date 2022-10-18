const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection(process.env.boardServer);

const freeBoardContents = new Schema({
    contents: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);



const freeBoard = new Schema({
    storeID: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: freeBoardContents,
        default: {}
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardComment',
    },
    heart: {
        type: Array,
    },
});

module.exports = connectionBoards.model('freeBoard', freeBoard);
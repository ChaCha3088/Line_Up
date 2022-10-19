const mongoose = require('mongoose');
const connectionBoards = mongoose.createConnection(process.env.boardServer);
const { Schema } = mongoose;

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
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'FreeBoardComment',
    }],
    heart: {
        type: Array,
    },
});

module.exports = connectionBoards.model('FreeBoard', freeBoard);
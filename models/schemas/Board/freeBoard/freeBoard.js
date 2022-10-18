const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection('mongodb://localhost:27017/Boards');

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
        type: String,
        required: true,
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardComment',
    },
    recomments: {
        type: Schema.Types.ObjectId,
        ref: 'freeBoardReComment',
    },
    heart: {
        type: Array,
    },
},
{ timestamps: true },
);

module.exports = connectionBoards.model('freeBoard', freeBoard);
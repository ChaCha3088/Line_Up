const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionBoards = mongoose.createConnection(process.env.boardServer);

const userHistory = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    musicList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'musicList',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoard',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoardComment',
    }],
    recomments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeBoardReComment',
    }],
});

module.exports = connectionBoards.model('userHistory', userHistory);

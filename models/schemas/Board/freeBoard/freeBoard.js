const mongoose = require('mongoose');
const { Schema } = mongoose;
const freeBoard = new Schema({
    storeID: String,
    postID: Number,
    ID: String,
    title: String,
    contents: String,
    heart: {
        ID: String,
    },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('freeBoard', freeBoard);
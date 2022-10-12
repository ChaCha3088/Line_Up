const mongoose = require('mongoose');
const { Schema } = mongoose;
const freeBoardsReComment = new Schema({
    storeID: String,
    postID: Number,
    ID: String,
    contents: String,
    heart: {
        ID: String,
    },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('freeBoardsReComment', freeBoardsReComment);
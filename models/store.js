const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');
const freeBoard = require('./schemas/Board/freeBoard/freeBoard');
const freeBoardComment = require('./schemas/Board/freeBoard/freeBoardComment');
const freeBoardReComment = require('./schemas/Board/freeBoard/freeBoardReComment');
const musicList = require('../models/schemas/Board/musicList');



module.exports = {
    getFreeBoardLists: async function(storeID, pages) {
        let result = await freeBoard.find({'storeID': storeID}).skip((pages-1) * 20).limit(20).sort({'createdAt': -1})
        .populate({
            path: 'comments',
            populate: {
                path: 'recomments',
        }})
        .exec();
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목 최대 20글자, 내용 조금 40글자, 작성 시간, Heart 개수, Comment + ReComment 개수
        return result;
    },



    getFreeBoardPost: async function(postID) {
        let result = await freeBoard.findOne({'_id': postID}).populate({
            path: 'comments',
            populate: {
                path: 'recomments',
        }})
        .exec();
        return result;
    },
    postFreeBoardPost: async function(storeID, req) {
        let result =  await freeBoard.create({
            'storeID': storeID,
            'email': req.user.email,
            'title': req.body.title,
            'contents': req.body.contents,
            'heart': [],
            });
        return result;
        },
    updateFreeBoardPost: async function(storeID, postID, req) {
        await freeBoard.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': postID,
            },
            {
                'title': req.body.title,
                'contents': req.body.contents,
            })
        },
    deleteFreeBoardPost: async function(storeID, postID) {
        await freeBoard.findOneAndDelete(
            {
                'storeID': storeID,
                '_id': postID
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'recomments',
            }})
            .exec();
        await freeBoardComment.findOneAndDelete(
            {
                'storeID': storeID,
                'postID': postID
            }).exec();
        await freeBoardReComment.findOneAndDelete(
            {
                'storeID': storeID,
                'postID': postID
            }).exec();
        },



    postFreeBoardComment: async function(storeID, postID, req) {
        await freeBoardComment.create({
            'storeID': storeID,
            '_id': postID,
            'email': req.user.email,
            'contents': req.body.contents,
        });
    },
    updateFreeBoardComment: async function(_id, commentID, req) {
        await freeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': _id,
                'commentID': commentID
            },
            {
                'contents': req.body,
            })
        },
    deleteFreeBoardComment: async function(storeID, _id, commentID) {
        await freeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': _id,
                'commentID': commentID
            },
            {
                'contents': '',
            })
        },



    postFreeBoardReComment: async function(storeID, _id, commentID, req) {
        await freeBoardReComment.create({
            'storeID': storeID,
            '_id': _id,
            'commentID': commentID,
            'ID': req.user.ID,
            'contents': req.body,
        });
    },
    updateFreeBoardReComment: async function(_id, commentID, recommentID, req) {
        await freeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': _id,
                'commentID': commentID,
                'recommentID': recommentID
            },
            {
                'contents': req.body,
            })
        },
    deleteFreeBoardReComment: async function(storeID, _id, commentID, recommentID) {
        await freeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': _id,
                'commentID': commentID,
                'recommentID': recommentID
            },
            {
                'contents': '',
            })
        },



    getSongRequestLists: async function(storeID, pages) {
        let result = await musicList.find({'storeID': storeID}).skip((pages-1) * 20).limit(20).sort({'contents.timestamps.createdAt': -1});
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목, 내용, 작성 시간, Heart 개수, Comment + ReComment 개수
        return result;
    },



    postSongRequests: async function(storeID, req) {
        await musicList.create({
            'storeID': storeID,
            'ID': req.user.ID,
            'artist': req.body,
            'title': req.body,
            });
        },
    updateSongRequests: async function(storeID, _id, req) {
        await musicList.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': _id,
            },
            {
                'artist': req.body,
                'title': req.body,
            });
        },
    deleteSongRequests: async function(storeID, _id) {
        await musicList.deleteOne(
            {
                'storeID': storeID,
                '_id': _id
            });
        },



    getMenus: async function(storeID) {
        const queryInput = { type: "menu" };
        const storeCollection = connectionInfoStores.db.collection(`${storeID}`);
        const result = await storeCollection.findOne(queryInput, {lean: true});
        return result.menu;
    },

}
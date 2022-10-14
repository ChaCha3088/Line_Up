const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');
const connectionFreeBoards = mongoose.createConnection('mongodb://localhost:27017/InfoStores');
const AAA = require('../models/schemas/InfoStores/AAA');
const nal = require('../models/schemas/InfoStores/nal');
const freeBoard = require('../models/schemas/Board/freeBoard/freeBoard');
const freeBoardComment = require('../models/schemas/Board/freeBoard/freeBoardComment');
const freeBoardReComment = require('../models/schemas/Board/freeBoard/freeBoardReComment');
const musicList = require('../models/schemas/Board/musicList');



module.exports = {
    getFreeBoardLists: async function(storeID, pages) {
        let result = await freeBoard.find({'storeID': storeID}).skip((pages-1) * 20).limit(20).sort({'contents.timestamps.createdAt': -1});
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목 최대 20글자, 내용 조금 40글자, 작성 시간, Heart 개수, Comment + ReComment 개수
        return result;
    },



    getFreeBoardPost: async function(postID) {
        let result = await freeBoard.findById(postID);
        return result;
    },
    postFreeBoardPost: async function(storeID, req) {
        await freeBoard.create({
            'storeID': storeID,
            'ID': req.user.ID,
            'title': req.,
            'contents': req.,
            });
        },
    updateFreeBoardPost: async function(storeID, postID, req) {
        await freeBoard.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
            },
            {
                'title': req.,
                'contents': req.,
            })
        },
    deleteFreeBoardPost: async function(storeID, postID) {
        await freeBoard.deleteMany(
            {
                'storeID': storeID,
                'postID': postID
            });
        await freeBoardComment.deleteMany(
            {
                'storeID': storeID,
                'postID': postID
            });
        await freeBoardReComment.deleteMany(
            {
                'storeID': storeID,
                'postID': postID
            });
        },



    postFreeBoardComment: async function(storeID, postID, req) {
        await freeBoardComment.create({
            'storeID': storeID,
            'postID': postID,
            'ID': req.user.ID,
            'contents': req.,
        });
    },
    updateFreeBoardComment: async function(postID, commentID, req) {
        await freeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID
            },
            {
                'contents': req.,
            })
        },
    deleteFreeBoardComment: async function(storeID, postID, commentID) {
        await freeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID
            },
            {
                'contents': '',
            })
        },



    postFreeBoardReComment: async function(storeID, postID, commentID, req) {
        await freeBoardReComment.create({
            'storeID': storeID,
            'postID': postID,
            'commentID': commentID,
            'ID': req.user.ID,
            'contents': req.,
        });
    },
    updateFreeBoardReComment: async function(postID, commentID, recommentID, req) {
        await freeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID,
                'recommentID': recommentID
            },
            {
                'contents': req.,
            })
        },
    deleteFreeBoardReComment: async function(storeID, postID, commentID, recommentID) {
        await freeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
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
            'artist': req.,
            'title': req.,
            });
        },
    updateSongRequests: async function(storeID, postID, req) {
        await musicList.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
            },
            {
                'artist': req.,
                'title': req.,
            });
        },
    deleteSongRequests: async function(storeID, postID) {
        await musicList.deleteOne(
            {
                'storeID': storeID,
                'postID': postID
            });
        },



    getMenus: async function(storeID) {
        const queryInput = { type: "menu" };
        const storeCollection = connectionInfoStores.db.collection(`${storeID}`);
        const result = await storeCollection.findOne(queryInput, {lean: true});
        return result.menu;
    },

}
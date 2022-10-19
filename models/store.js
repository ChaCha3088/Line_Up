const mongoose = require('mongoose');
mongoose.createConnection(process.env.boardServer);
const FreeBoard = require('./schemas/Board/freeBoard/freeBoard');
const FreeBoardComment = require('./schemas/Board/freeBoard/freeBoardComment');
const FreeBoardReComment = require('./schemas/Board/freeBoard/freeBoardReComment');
const musicList = require('../models/schemas/Board/musicList');



const findValue = function (targetObj, value) {
    if (Object.keys(targetObj).find(key => targetObj[key] === value)) {
        return true;
    } else {
        return false;
    }
}



module.exports = {
    findValue: findValue,



    getFreeBoardLists: async function(storeID, pages) {
        let result = await FreeBoard.find(
            {
                'storeID': storeID
            }).skip((pages-1) * 20).limit(20).sort({'contents.createdAt': -1})
        .populate({
            path: 'comments',
            model: FreeBoardComment,
            options: {
                sort: {
                    'contents.created_at': 1
                }
            },
            populate: {
                path: 'recomments',
                model: FreeBoardReComment,
                options: {
                    sort: {
                        'contents.created_at': 1
                    }
        }}})
        .exec();
        // console.log('getFreeBoardLists is')
        // console.log(getFreeBoardLists)
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목 최대 20글자, 내용 조금 40글자, 작성 시간, Heart 개수, Comment + ReComment 개수
        return result;
    },



    getFreeBoardPost: async function(storeID, postID) {
        let result = await FreeBoard.findOne(
            {
                'storeID': storeID,
                '_id': postID
            })
        .populate({
            path: 'comments',
            model: FreeBoardComment,
            options: {
                sort: {
                    'contents.created_at': 1
                }
            },
            populate: {
                path: 'recomments',
                model: FreeBoardReComment,
                options: {
                    sort: {
                        'contents.created_at': 1
                    }
        }}})
        .exec();
        return result;
    },
    postFreeBoardPost: async function(storeID, req) {
        let result = await FreeBoard.create({
            'storeID': storeID,
            'email': req.user.email,
            'title': req.body.title,
            'contents': {
                'contents': req.body.contents
            },
            'heart': []
            });
        return result;
        },
    postFreeBoardPostHeart: async function(storeID, postID, req) {
        try {
            let email = req.user.email
            let result =  await FreeBoard.findOne({
                'storeID': storeID,
                '_id': postID
            });
            let exist = findValue(result.heart, email);
            if (exist == false) {
                await FreeBoard.findOneAndUpdate({
                    'storeID': storeID,
                    '_id': postID
                }, {
                    $push: {
                        'heart': email
                    }
                });            
                return 1;
            } else {
                return 0;
            }} catch (e) {
                console.log(e);
                return 0;
            }
        },
    updateFreeBoardPost: async function(storeID, postID, req) {
        await FreeBoard.findOneAndUpdate(
            {
                'storeID': storeID,
                '_id': postID,
            },
            {
                'title': req.body.title,
                'contents': {
                    'contents': req.body.contents,
                }
            });
        },
    deleteFreeBoardPost: async function(storeID, postID) {
        await FreeBoard.findOneAndDelete(
            {
                'storeID': storeID,
                '_id': postID
            })
            .exec();
        await FreeBoardComment.deleteMany(
            {
                'storeID': storeID,
                'postID': postID
            }).exec();
        await FreeBoardReComment.deleteMany(
            {
                'storeID': storeID,
                'postID': postID
            }).exec();
        },


    
    getFreeBoardComment: async function(storeID, postID, commentID) {
        let result = await FreeBoardComment.findOne(
            {
                'storeID': storeID,
                'postID': postID,
                '_id': commentID
            }).exec();
        return result;
    },
    postFreeBoardComment: async function(storeID, postID, req) {
        let result = await FreeBoardComment.create({
            '_id': mongoose.Types.ObjectId(),
            'storeID': storeID,
            'postID': mongoose.Types.ObjectId(postID),
            'email': req.user.email,
            'contents': {
                'contents': req.body.comment
            },
            'heart': []
            });
        await FreeBoard.findOneAndUpdate(
            {
            'storeID': storeID,
            'postID': postID,
            '_id': postID
        }, {
            $push: {
                'comments': mongoose.Types.ObjectId(result._id)
            }
        });
    },
    postFreeBoardCommentHeart: async function(storeID, postID, commentID, req) {
        try {
            let email = req.user.email
            let result =  await FreeBoardComment.findOne({
                'storeID': storeID,
                'postID': postID,
                '_id': commentID
            });
            let exist = findValue(result.heart, email);
            if (exist == false) {
                await FreeBoardComment.findOneAndUpdate({
                    'storeID': storeID,
                    'postID': postID,
                    '_id': commentID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                return 1;
            } else {
                return 0;
            }} catch (e) {
                console.log(e);
                return 0;
            }
        },
    updateFreeBoardComment: async function(storeID, postID, commentID, req) {
        await FreeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                '_id': commentID,
            },
            {
                'contents': {
                    'contents': req.body.contents,
            }});
        },
    deleteFreeBoardComment: async function(storeID, postID, commentID) {
        await FreeBoardComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                '_id': commentID
            },
            {
                'contents': {
                    'contents': '',
                    'isDeleted': true
                }
            })
        },



    // postFreeBoardReComment: async function(storeID, postID, commentID, req) {
    //     await FreeBoardReComment.create({
    //         'storeID': storeID,
    //         'postID': postID,
    //         '_id': commentID,
    //         'ID': req.user.ID,
    //         'contents': req.body,
    //     });
    // },
    getFreeBoardReComment: async function(storeID, postID, commentID, recommentID) {
        let result = await FreeBoardReComment.findOne(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID,
                '_id': recommentID
            }).exec();
        return result;
    },
    postFreeBoardReComment: async function(storeID, postID, commentID, req) {
        let result = await FreeBoardReComment.create({
            '_id': mongoose.Types.ObjectId(),
            'storeID': storeID,
            'postID': mongoose.Types.ObjectId(postID),
            'commentID': mongoose.Types.ObjectId(commentID),
            'email': req.user.email,
            'contents': {
                'contents': req.body.recomment
            },
            'heart': []
            });
        await FreeBoardComment.findOneAndUpdate(
            {
            'storeID': storeID,
            'postID': postID,
            '_id': commentID
        }, {
            $push: {
                'recomments': mongoose.Types.ObjectId(result._id)
            }
        });
    },
    postFreeBoardReCommentHeart: async function(storeID, postID, commentID, recommentID, req) {
        try {
            let email = req.user.email
            let result =  await FreeBoardReComment.findOne({
                'storeID': storeID,
                'postID': postID,
                '_id': recommentID
            });
            let exist = findValue(result.heart, email);
            if (exist == false) {
                await FreeBoardReComment.findOneAndUpdate({
                    'storeID': storeID,
                    'postID': postID,
                    'commentID': commentID,
                    '_id': recommentID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                return 1;
            } else {
                return 0;
            }} catch (e) {
                console.log(e);
                return 0;
            }
        },
    updateFreeBoardReComment: async function(storeID, postID, commentID, recommentID, req) {
        await FreeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID,
                '_id': recommentID,
            },
            {
                'contents': {
                    'contents': req.body.contents,
            }})
        },
    deleteFreeBoardReComment: async function(storeID, postID, commentID, recommentID) {
        await FreeBoardReComment.findOneAndUpdate(
            {
                'storeID': storeID,
                'postID': postID,
                'commentID': commentID,
                '_id': recommentID,
            },
            {
                'contents': {
                    'contents': '',
                    'isDeleted': true
                }
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



    

}
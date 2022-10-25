const mongoose = require('mongoose');
const { Schema } = mongoose;
const FreeBoard = require('./schemas/Board/freeBoard/freeBoard');
const FreeBoardComment = require('./schemas/Board/freeBoard/freeBoardComment');
const FreeBoardReComment = require('./schemas/Board/freeBoard/freeBoardReComment');
const order = require('./schemas/Info/order');
const storeInfo = require('./schemas/Info/storeInfo');
const musicList = require('../models/schemas/Board/musicList');
const User = require('./schemas/user');
const UserHistory = require('./schemas/Board/userHistory');
const infoModel = require('./info');



const findValue = function (targetObj, value) {
    if (Object.keys(targetObj).find(key => targetObj[key] === value)) {
        return true;
    } else {
        return false;
    }
}
const findKey = function (targetObj, key) {
    return Object.keys(targetObj).includes(key);
}

const calculateSumAndCount = function(result) {
    var sum = 0;
    var allCount = 0;
    for (i of result.orders) {
        sum = sum + parseInt(i.price) * parseInt(i.count)
        allCount = allCount + parseInt(i.count)
    }
    return {
        sum: sum,
        allCount: allCount
    }
}

const getAvailableTableLists = async function(storeID) {
    var result = await storeInfo.findOne(
        {
            'storeID': storeID
        })
    .populate(
        {
            path: 'tableLists',
            select: 'tableNumber',
            model: order
        });

    var resultArray = [];
    for (i of result.tableLists) {
        resultArray.push(i.tableNumber);
    }
    var maxTableArray = [];
    for (i = 1; i <= result.maxTable; i++) {
        maxTableArray.push(i);
    }
    if (Array.isArray(resultArray) && resultArray.length >= 1) {
        var availableTableArray = maxTableArray.filter(x => !resultArray.includes(x)).sort(function(a, b) {
            return a - b;
        });
        var availableTables = availableTableArray
    } else if (Array.isArray(resultArray) && resultArray.length == 0) {
        var availableTables = maxTableArray;
    }
    let takenTables = resultArray
    return {
        maxTable: result.maxTable,
        availableTables: availableTables,
        takenTables: takenTables
    }
}



module.exports = {
    findValue: findValue,
    findKey: findKey,
    calculateSumAndCount: calculateSumAndCount,
    getAvailableTableLists: getAvailableTableLists,



    validStoreName: async function(req, res, next) {
        var result = await storeInfo.findOne(
            {
                'storeID': req.params.storeID
            }
        )
        if (result == null) {
            res.redirect('/');
            return;
        } else {
            next();
            return;
        }
    },



    getFreeBoardLists: async function(storeID, pages) {
        try {
            var result = await FreeBoard.find(
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
                        }}
                    }})
            .exec();
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목 최대 20글자, 내용 조금 40글자, 작성 시간, Heart 개수, Comment + ReComment 개수
    },



    getFreeBoardPost: async function(storeID, postID) {
        try {
            var result = await FreeBoard.findOne(
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
                        }}
                    }})
            .exec();
            if (result == null) {
                throw new Error('Getting FreeBoardPost Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postFreeBoardPost: async function(storeID, req) {
        try {
            var createFreeBoardPostResult = await FreeBoard.create({
                'storeID': storeID,
                'email': req.user.email,
                'title': req.body.title,
                'contents': {
                    'contents': req.body.contents
                },
                'heart': []
                });
            
            if (createFreeBoardPostResult == null) {
                throw new Error('Creating FreeBoardPost Failed!')
            }

            var populateUserHistoryResult = await UserHistory.findOneAndUpdate(
                {
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $push: {
                    'posts': 
                        mongoose.Types.ObjectId(createFreeBoardPostResult._id)
                }
            });

            if (populateUserHistoryResult == null) {
                throw new Error('Populating UserHistory Failed!')
            }
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postFreeBoardPostHeart: async function(storeID, postID, req) {
        try {
            var email = req.user.email
            var result =  await FreeBoard.findOne({
                'storeID': storeID,
                '_id': postID
            });
            var exist = findValue(result.heart, email);
            if (exist == false) {
                let writingHeartOnPostResult = await FreeBoard.findOneAndUpdate({
                    'storeID': storeID,
                    '_id': postID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                if (writingHeartOnPostResult == null) {
                    throw new Error('Writing Heart on Post failed!')
                }
                return true;
            }
            return;
        } catch (e) {
                console.log(e);
                return false;
            }
    },
    updateFreeBoardPost: async function(storeID, postID, req) {
        try{
            var result = await FreeBoard.findOneAndUpdate(
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
            if (result == null) {
                throw new Error('Updating FreeBoardPost Failed!')
            }
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    deleteFreeBoardPost: async function(storeID, postID, req) {
        try {
            await FreeBoardReComment.deleteMany(
                {
                    'storeID': storeID,
                    'postID': postID
                }).exec();
            await FreeBoardComment.deleteMany(
                {
                    'storeID': storeID,
                    'postID': postID
                }).exec();
            var deleteFreeBoardPostResult = await FreeBoard.findOneAndDelete(
                {
                    'storeID': storeID,
                    '_id': postID
                })
                .exec();
            if (deleteFreeBoardPostResult == null) {
                throw new Error('Deleting FreeBoardPost Failed!')
            }
            var deleteUserHistoryResult = await UserHistory.findOneAndUpdate(
                {
                    'userName': req.user.userName,
                    'email': req.user.email,
                }, {
                    $pull: {
                        'posts': mongoose.Types.ObjectId(deleteFreeBoardPostResult._id)
                    }
                });
            if (deleteUserHistoryResult == null) {
                throw new Error('Deleting Populated FreeBoardPost Failed!')
            }
        } catch (e) {
            console.log(e)
            return false;
        }
    },
        

    
    getFreeBoardComment: async function(storeID, postID, commentID) {
        try {
            var result = await FreeBoardComment.findOne(
                {
                    'storeID': storeID,
                    'postID': postID,
                    '_id': commentID
                }).exec();
            if (result == null) {
                throw new Error('Getting FreeBoardComment Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
        
    },
    postFreeBoardComment: async function(storeID, postID, req) {
        try {
            var createResult = await FreeBoardComment.create({
                '_id': mongoose.Types.ObjectId(),
                'storeID': storeID,
                'postID': mongoose.Types.ObjectId(postID),
                'email': req.user.email,
                'contents': {
                    'contents': req.body.comment
                },
                'heart': []
                });
            if (createResult == null) {
                throw new Error('Creating Comment failed!')
            }
            var populatePostResult = await FreeBoard.findOneAndUpdate(
                {
                'storeID': storeID,
                'postID': postID,
                '_id': postID
            }, {
                $push: {
                    'comments': mongoose.Types.ObjectId(createResult._id)
                }
            });
            if (populatePostResult == null) {
                throw new Error('Writing _id for Post Population failed!')
            } 
            var populateHistoryResult = await UserHistory.findOneAndUpdate({
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $push: {
                    'comments': mongoose.Types.ObjectId(createResult._id)
                }
            });
            if(populateHistoryResult == null) {
                throw new Error('Writing _id for History Population failed!')
            }
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postFreeBoardCommentHeart: async function(storeID, postID, commentID, req) {
        try {
            var email = req.user.email
            var findCommentResult = await FreeBoardComment.findOne({
                'storeID': storeID,
                'postID': postID,
                '_id': commentID
            });
            if (findCommentResult == null) {
                throw new Error('Finding Comment failed!')
            }
            var exist = findValue(findCommentResult.heart, email);
            if (exist == false) {
                var writingHeartOnCommentResult = await FreeBoardComment.findOneAndUpdate({
                    'storeID': storeID,
                    'postID': postID,
                    '_id': commentID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                if (writingHeartOnCommentResult == null) {
                    throw new Error('Writing Heart on Comment failed!')
                }
                return true;
            }
            return;
        } catch (e) {
                console.log(e);
                return false;
        }
    },
    updateFreeBoardComment: async function(storeID, postID, commentID, req) {
        try {
            var result = await FreeBoardComment.findOneAndUpdate(
                {
                    'storeID': storeID,
                    'postID': postID,
                    '_id': commentID,
                },
                {
                    'contents': {
                        'contents': req.body.contents,
                }});
            if (result == null) {
                throw new Error('Updating FreeBoardComment Failed!')
            }
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    deleteFreeBoardComment: async function(storeID, postID, commentID, req) {
        try {
            var deleteFreeBoardCommentResult = await FreeBoardComment.findOneAndUpdate(
                {
                    'storeID': storeID,
                    'postID': postID,
                    '_id': commentID
                },
                {
                    'contents': {
                        'contents': '',
                        'isdeleted': true
                    }
                });
            if (deleteFreeBoardCommentResult == null) {
            throw new Error('Deleting FreeBoardComment Failed!')
            }
            var deleteUserHistoryResult = await UserHistory.findOneAndUpdate({
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $pull: {
                    'comments': mongoose.Types.ObjectId(deleteFreeBoardCommentResult._id)
                }
            });
            if (deleteUserHistoryResult == null) {
                throw new Error('Deleting Populated FreeBoardComment Failed!')
            }
        } catch (e) {
            console.log(e)
            return false;
        }
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
        try {
            var result = await FreeBoardReComment.findOne(
                {
                    'storeID': storeID,
                    'postID': postID,
                    'commentID': commentID,
                    '_id': recommentID
                }).exec();
            if (result == null) {
                throw new Error('Getting FreeBoardReComment Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postFreeBoardReComment: async function(storeID, postID, commentID, req) {
        try {
            var result = await FreeBoardReComment.create({
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
            await UserHistory.findOneAndUpdate({
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $push: {
                    'recomments': mongoose.Types.ObjectId(result._id)
                }
            });
        } catch (e) {

        }
    },
    postFreeBoardReCommentHeart: async function(storeID, postID, commentID, recommentID, req) {
        try {
            var email = req.user.email
            var result =  await FreeBoardReComment.findOne({
                'storeID': storeID,
                'postID': postID,
                '_id': recommentID
            });
            var exist = findValue(result.heart, email);
            if (exist == false) {
                let writingHeartOnReCommentResult = await FreeBoardReComment.findOneAndUpdate({
                    'storeID': storeID,
                    'postID': postID,
                    'commentID': commentID,
                    '_id': recommentID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                if (writingHeartOnReCommentResult == null) {
                    throw new Error('Writing Heart on ReComment Failed!')
                }
                return true;
            }
            return;
        } catch (e) {
            console.log(e);
            return false;
        }
        },
    updateFreeBoardReComment: async function(storeID, postID, commentID, recommentID, req) {
        try {
            let result = await FreeBoardReComment.findOneAndUpdate(
                {
                    'storeID': storeID,
                    'postID': postID,
                    'commentID': commentID,
                    '_id': recommentID,
                },
                {
                    'contents': {
                        'contents': req.body.contents,
                }});
            if (result == null) {
                throw new Error('Updating FreeBoardReComment Failed!')
            }
            return ;
        } catch (e) {
            console.log(e)
            return false;
        }
        },
    deleteFreeBoardReComment: async function(storeID, postID, commentID, recommentID, req) {
        try {
            var deleteFreeBoardReCommentResult = await FreeBoardReComment.findOneAndDelete(
                {
                    'storeID': storeID,
                    'postID': postID,
                    'commentID': commentID,
                    '_id': recommentID,
                });
            let deletePopulatedFreeBoardCommentResult = await FreeBoardReComment.findOneAndUpdate(
                {
                    'storeID': storeID,
                    'postID': postID,
                    '_id': deleteFreeBoardReCommentResult.commentID,
                }, {
                    $pull: {
                        'recomments': mongoose.Types.ObjectId(deleteFreeBoardReCommentResult._id)
                    }
                });
            let deletePopulatedFreeBoardReCommentResult = await UserHistory.findOneAndUpdate(
                {
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $pull: {
                    'recomments': mongoose.Types.ObjectId(deleteFreeBoardReCommentResult._id)
                }
            });
            if (deleteFreeBoardReCommentResult == null) {
                throw new Error('Deleting FreeBoardReComment Failed!')
            }
            if (deletePopulatedFreeBoardCommentResult == null) {
                throw new Error('Deleting PopulatedFreeBoardComment Failed!')
            }
            if (deletePopulatedFreeBoardReCommentResult == null) {
                throw new Error('Deleting PopulatedFreeBoardReComment Failed!')
            }
            return;
        } catch (e) {
            console.log(e)
            return false;
        }
        },



    
    getTableStatus: async function(storeID) {
        try {
            let result = await getAvailableTableLists(storeID)
            var resultArray = []
            var iterationArray = result.takenTables

            for (var i of iterationArray) {
                let result = await order.findOne(
                    {
                        'storeID': storeID,
                        'tableNumber': i,
                    }
                ).exec();

                if (result == null) {
                    throw new Error('Finding Table Failed!')
                }
                let calculateResult = calculateSumAndCount(result)

                resultArray.push(
                    {
                        'tableNumber': parseInt(i),
                        'sum': calculateResult.sum,
                        'createdAt': result.createdAt
                    });
                }
            return resultArray
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    getOrderLists: async function(storeID, tableNumber, req) {
        try {
            let result = await order.findOne(
                {
                    'storeID': storeID,
                    'tableNumber': tableNumber,
                }
            ).exec();
            if (result == null) {
                throw new Error('Finding Table Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    /** 생성시 storeInfo와 userSchema에도 order._id가 입력됨 */
    postNewTable: async function(storeID, tableNumber, req) {
        var result = await order.create(
            {
                '_id': mongoose.Types.ObjectId(),
                'storeID': storeID,
                'leaderEmail': req.user.email,
                'tableNumber': tableNumber,
            });
        await storeInfo.findOneAndUpdate(
            {
                'storeID': storeID,
            },
            {
                $push: {
                    'tableLists': mongoose.Types.ObjectId(result._id)
                }
            });
        await User.findOneAndUpdate(
            {
                'email': req.user.email
            },
            {
                'tableNumber': tableNumber
            });
    },
    postNewDish: async function(storeID, tableNumber, menuName, req) {
        try {
            var result = await infoModel.getStoreMenus(storeID);
            // orders.name으로 주문한 메뉴를 찾아보고,
            // 이미 있으면 count만 데려와서 더해주기, 없으면 $push
            var resultTableOrder = await order.findOne(
                {
                    'storeID': storeID,
                    'tableNumber': tableNumber,
                    'leaderEmail': req.user.email,
                    'didPay': false
                }
            ).exec();
            var orderArray = [];
            for (i of resultTableOrder.orders) {
                orderArray.push(i.name);
            }
            var foundTableOrder = resultTableOrder.orders.find(e => e.name === `${menuName}`)
            if (orderArray.includes(menuName) == true) {
                var beforeCount = Number(foundTableOrder.count);
                var result = await order.findOneAndUpdate(
                    {
                        'storeID': storeID,
                        'tableNumber': tableNumber,
                        'leaderEmail': req.user.email,
                        'orders': { $elemMatch: {
                            'name': menuName
                        }}
                    },
                    {
                        $set: {
                            'orders.$.count': beforeCount + Number(req.body.count)
                        }
                    }).exec();
                return;
            } else if (orderArray.includes(menuName) == false) {
                var result = await order.findOneAndUpdate(
                    {
                        'storeID': storeID,
                        'tableNumber': tableNumber,
                        'leaderEmail': req.user.email,
                    },
                    {
                        $push: {
                            'orders': {
                                'name': menuName,
                                'price': result.result[`${menuName}`],
                                'count': Number(req.body.count)
                            }
                        }
                    }
                );
                return;
            }
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    deleteDish: async function(storeID, tableNumber, menuName, req) {

    },
    menuValidationMiddleware: async function(req, res, next) {
        var result = await infoModel.getStoreMenus(req.params.storeID);
            if (!result.result.hasOwnProperty(`${req.params.menuName}`)) {
                res.redirect(`/stores/${req.params.storeID}/tables/${req.params.tableNumber}`)
                throw new Error('menuName is not valid')
            } else {
                next();
                return;
            }
    },
    takenTableMiddleware: async function(req, res, next) {
        try {
            var result = await order.findOne(
                {
                    'storeID': req.params.storeID,
                    'tableNumber': req.params.tableNumber
                }
            ).exec();
            if (result == null) {
                next();
                return;
            } else {
                res.redirect(`/stores/${req.params.storeID}/tableSelect`);
                return;
            }
        } catch (e) {
            console.log(e);
            res.redirect(`/stores/${req.params.storeID}/tableSelect`);
            return;
        }
    },
    userstableExistMiddleware: async function(req, res, next) {
        try {
            var result = await User.findOne(
                {
                    'email': req.user.email
                }
            ).exec();
            if (result.tableNumber == undefined) {
                next();
                return;
            } else {
                res.redirect('/');
                return;
            }
        } catch (e) {
            console.log(e);
            res.redirect('/');
            return;
        }
    },
    tableLeaderMiddleware: async function(req, res, next) {
        try {
            var result = await User.findOne(
                {
                    'email': req.user.email
                }
            ).exec();
            if (req.user.hasOwnProperty('admin') && req.user.admin === true) {
                next();
                return;
            } else if (result.tableNumber == req.params.tableNumber) {
                next();
                return;
            } else {
                res.redirect('/');
                return;
            }
        } catch (e) {
            console.log(e);
            res.redirect('/');
            return;
        }
    },
    getLeaderInfo: async function(req) {
        try {
            var result = await User.findOne(
                {
                    'email': req.user.email
                }
            ).exec();
            if (result.tableNumber !== undefined) {
                return result.tableNumber;
            } else {
                return;
            }
        } catch (e) {
            console.log(e);
            return;
        }
    },


    getSongRequestLists: async function(storeID, pages) {
        var result = await musicList.find(
            {
                'storeID': storeID
            }).skip((pages-1) * 20).limit(20).sort({'createdAt': -1})
        .exec();
        //storeID가 storeID인 것을 page 수에 맞게 20개 찾아
        //제목 최대 20글자, 내용 조금 40글자, 작성 시간, Heart 개수
        return result;
    },
    getSongRequestPost: async function(storeID, postID) {
        try {
            var result = await musicList.findOne(
                {
                    'storeID': storeID,
                    '_id': postID
                })
            .exec();
            if (result == null) {
                throw new Error('Finding musicList Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postSongRequestPost: async function(storeID, req) {
        try {
            var result = await musicList.create({
                'storeID': storeID,
                'email': req.user.email,
                'artist': req.body.artist,
                'title': req.body.title,
                'heart': []
                });
            if (result == null) {
                throw new Error('Creating new musicList Failed!')
            }
            var historyResult = await UserHistory.findOneAndUpdate(
                {
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $push: {
                    'musicList': 
                        mongoose.Types.ObjectId(result._id)
                }
            });
            if (historyResult == null) {
                throw new Error('Pushing new PopulatedMusicList Failed!')
            }
            return result;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    postSongRequestPostHeart: async function(storeID, postID, req) {
        try {
            var email = req.user.email
            var result =  await musicList.findOne({
                'storeID': storeID,
                '_id': postID
            });
            if (result == null) {
                throw new Error('Finding musicList Failed!')
            }
            var exist = findValue(result.heart, email);
            if (exist == false) {
                let writingHeartOnSongRequestPost = await musicList.findOneAndUpdate({
                    'storeID': storeID,
                    '_id': postID
                }, {
                    $push: {
                        'heart': email
                    }
                });
                if (writingHeartOnSongRequestPost == null) {
                    throw new Error('Writing Heart on SongRequest Failed!')
                }       
                return true;
            }
            return;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    updateSongRequestPost: async function(storeID, postID, req) {
        try {
            let result = await musicList.findOneAndUpdate(
                {
                    'storeID': storeID,
                    '_id': postID,
                },
                {
                    'title': req.body.title,
                });
            if (result == null) {
                return false;
            }
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    deleteSongRequestPost: async function(storeID, postID, req) {
        try {
            var result = await musicList.findOneAndDelete(
                {
                    'storeID': storeID,
                    '_id': postID
                })
                .exec();
            if (result == null) {
                throw new Error('Deleting musicList Failed!')
            }
            let historyResult = await UserHistory.findOneAndUpdate({
                'userName': req.user.userName,
                'email': req.user.email
            }, {
                $pull: {
                    'musicList': mongoose.Types.ObjectId(result._id)
                }
            });
            if (historyResult == null) {
                throw new Error('Deleting PopulatedMusicList Failed!')
            } 
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
}
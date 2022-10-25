const { Router } = require('express');
const router = Router();
const passport = require('passport');
const express = require("express");
const app = express();
const userModel = require('../models/user');
const storeModel = require('../models/store');
const infoModel = require('../models/info');



app.use(passport.session());



//store의 메인 페이지
router.get("/:storeID", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var leaderInfo = await storeModel.getLeaderInfo(req);
    if (leaderInfo == undefined) {
        var context = {
            pageTitle: storeID,
            storeID: storeID,
        }
    } else {
        var context = {
            pageTitle: storeID,
            storeID: storeID,
            leaderInfo: leaderInfo
        }
    };
    res.render('store', context);
});



//store의 자유게시판 글 목록
router.get("/:storeID/freeBoards/pages/:pages", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var pages = String(req.params.pages);
        var freeBoardListsResult = await storeModel.getFreeBoardLists(storeID, pages);
        const context = {
            pageTitle: '자유게시판',
            storeID: storeID,
            freeBoardListsResult: freeBoardListsResult,
            pages: pages
        };
        res.render('freeBoardLists', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/`)
    }
});



//store의 자유게시판의 글 읽기
router.get("/:storeID/freeBoards/posts/:postID", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.getFreeBoardPost(storeID, postID);
        if (result == false) {
            throw new Error('게시물 못 찾음')
        }
        var context = {
            pageTitle: result.title,
            result: result,
            storeID: storeID,
            postID: postID,
            req: req
        }
        res.render('freeBoardRead', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 작성 페이지
router.get("/:storeID/freeBoards/write", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var context = {
            pageTitle: '게시글 작성',
            storeID: storeID
        };
        res.render('freeBoardWrite', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 수정 페이지
router.get("/:storeID/freeBoards/posts/:postID/modifyPage", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.getFreeBoardPost(storeID, postID);
        if (result == null) {
            throw new Error('게시물 못 찾음')
        }
        var context = {
            pageTitle: '게시글 수정',
            storeID: storeID,
            postID: postID,
            result: result
        };
        res.render('freeBoardModify', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 작성 post 요청
router.post('/:storeID/freeBoards/write', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var result = await storeModel.postFreeBoardPost(storeID, req);
        if (result == false) {
            throw new Error('Posting FreeBoardPost Failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/posts/${result._id}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/hearts', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.postFreeBoardPostHeart(storeID, postID, req);
        console.log(result)
        if (result == true || result == undefined) {
            res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
            return;
        } else if (result == false) {
            throw new Error('Post FreeBoardPostHeart Failed!')
        }
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 수정 update 요청
router.post('/:storeID/freeBoards/posts/:postID/modify', storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.updateFreeBoardPost(storeID, postID, req);
        if (result == false) {
            throw new Error('Updating FreeBoardPost Failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 글 삭제 delete 요청
router.get('/:storeID/freeBoards/posts/:postID/delete', storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.deleteFreeBoardPost(storeID, postID, req);
        if (result == false) {
            throw new Error('Deleting FreeBoardPost Failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});



//store의 자유게시판의 댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/write", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.postFreeBoardComment(storeID, postID, req);
        if (result == false) {
            throw new Error('Creating Comment failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 댓글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/comments/:commentID/commentHearts', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var result = await storeModel.postFreeBoardCommentHeart(storeID, postID, commentID, req);
        if (result == true || result == undefined) {
            res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
            return;
        }
        else if (result == false) {
            throw new Error('Giving Heart on FreeBoardComment Failed!')
        }
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 댓글 수정 페이지 get 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/modifyPage", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var result = await storeModel.getFreeBoardComment(storeID, postID, commentID);
        if (result == false) {
            throw new Error('Getting FreeBoardComment Failed!')
        }
        var context = {
            pageTitle: '댓글 수정',
            storeID: storeID,
            postID: postID,
            commentID: commentID,
            result: result
        };
        res.render('freeBoardCommentModify', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 댓글 수정 update 요청
router.post("/:storeID/freeBoards/posts/:postID/comments/:commentID/modify", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var result = await storeModel.updateFreeBoardComment(storeID, postID, commentID, req);
        if (result == false) {
            throw new Error('Updating FreeBoardComment Failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});
//store의 자유게시판의 댓글 삭제 delete 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/delete", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try{
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var result = await storeModel.deleteFreeBoardComment(storeID, postID, commentID, req);
        if (result == false) {
            throw new Error ('Deleting FreeBoardComment Failed!')
        }
        res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/pages/1`)
    }
});



//store의 자유게시판의 대댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/comments/:commentID/write", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var postID = String(req.params.postID);
    var commentID = String(req.params.commentID);
    await storeModel.postFreeBoardReComment(storeID, postID, commentID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 대댓글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/reCommentHearts', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var recommentID = String(req.params.recommentID);
        let result = await storeModel.postFreeBoardReCommentHeart(storeID, postID, commentID, recommentID, req);
        if (result == true || result == undefined) {
            res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
            return;
        } else if (result == false) {
            throw new Error('Posting Heart on FreeBoardReComment Failed!');
        }} catch (e) {
            console.log(e)
            res.redirect(`/stores/${storeID}/freeBoards/pages/1`);
        }
});
//store의 자유게시판의 대댓글 수정 페이지 get 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/modifyPage", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var commentID = String(req.params.commentID);
        var recommentID = String(req.params.recommentID);
        var result = await storeModel.getFreeBoardReComment(storeID, postID, commentID, recommentID);
        if (result == false) {
            throw new Error('Getting FreeBoardReComment Failed!')
        }
        var context = {
            pageTitle: '대댓글 수정',
            storeID: storeID,
            postID: postID,
            commentID: commentID,
            recommentID: recommentID,
            result: result
        };
        res.render('freeBoardReCommentModify', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
    }
});
//store의 자유게시판의 대댓글 수정 update 요청
router.post("/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/modify", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var postID = String(req.params.postID);
    var commentID = String(req.params.commentID);
    var recommentID = String(req.params.recommentID);
    await storeModel.updateFreeBoardReComment(storeID, postID, commentID, recommentID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 대댓글 삭제 delete 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/delete", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.freeBoardAuthorCheckMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var postID = String(req.params.postID);
    var commentID = String(req.params.commentID);
    var recommentID = String(req.params.recommentID);
    await storeModel.deleteFreeBoardReComment(storeID, postID, commentID, recommentID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});

    

//store의 신청곡 게시판 글 목록
router.get("/:storeID/songRequests/pages/:pages", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var pages = String(req.params.pages);
    var songRequestListResult = await storeModel.getSongRequestLists(storeID, pages);
    const context = {
        pageTitle: '신청곡 게시판',
        storeID: storeID,
        songRequestListResult: songRequestListResult,
        pages: pages
    };
    res.render('songRequestLists', context);
});



//store의 신청곡 게시판 글 읽기
router.get("/:storeID/songRequests/posts/:postID", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.getSongRequestPost(storeID, postID);
        if (result == false) {
            throw new Error('Getting SongRequestPost Failed!')
        }
        var context = {
            pageTitle: result.title,
            result: result,
            storeID: storeID,
            postID: postID,
            req: req
        }
        res.render('songRequestRead', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    }
});
//store의 신청곡 게시판 글 작성 페이지
router.get("/:storeID/songRequests/write", storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var context = {
            pageTitle: '신청곡 작성',
            storeID: storeID
        };
        res.render('songRequestWrite', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    }
});
//store의 신청곡 게시판 글 수정 페이지
router.get("/:storeID/songRequests/posts/:postID/modifyPage", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.musicListAuthorCheckMiddleware, async (req, res, next) => {
    try{
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        var result = await storeModel.getSongRequestPost(storeID, postID);
        if (result == false) {
            throw new Error('Getting SongRequestPost Failed!')
        }
        var context = {
            pageTitle: '신청곡 수정',
            storeID: storeID,
            postID: postID,
            result: result
        };
        res.render('songRequestModify', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/songRequests/posts/${postID}`);
    }
});
//store의 신청곡 게시판 글 작성 post 요청
router.post('/:storeID/songRequests/write', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var result = await storeModel.postSongRequestPost(storeID, req);
        if (result == false) {
            throw new Error('Posting SongRequestPost Failed!')
        }
        res.redirect(`/stores/${storeID}/songRequests/posts/${result._id}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    }
});
//store의 신청곡 게시판 글 좋아요 post 요청
router.post('/:storeID/songRequests/posts/:postID/hearts', storeModel.validStoreName, userModel.logInCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        let result = await storeModel.postSongRequestPostHeart(storeID, postID, req);
        if (result == true || result == undefined) {
            res.redirect(`/stores/${storeID}/songRequests/posts/${postID}`);
        } else if (result == false) {
            throw new Error('Writing Heart on SongRequest Failed!')
        }} catch (e) {
            console.log(e)
            res.redirect(`/stores/${storeID}/songRequests/posts/${postID}`);
        }
});
//store의 신청곡 게시판 글 수정 update 요청
router.post('/:storeID/songRequests/posts/:postID/modify', storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.musicListAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        let result = await storeModel.updateSongRequestPost(storeID, postID, req);
        if (result == false) {
            throw new Error('Updating SongRequestPost Failed!')
        }
        res.redirect(`/stores/${storeID}/songRequests/posts/${postID}`);
    } catch (e) {
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    }

});
//store의 신청곡 게시판 글 삭제 delete 요청
router.get('/:storeID/songRequests/posts/:postID/delete', storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.musicListAuthorCheckMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var postID = String(req.params.postID);
        let result = await storeModel.deleteSongRequestPost(storeID, postID, req);
        if (result == false) {
            throw new Error('Deleting SongRequestPost Failed!')
        }
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/songRequests/pages/1`);
    }
});



//테이블 선택 페이지
router.get("/:storeID/tableSelect", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.userstableExistMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var result = await storeModel.getAvailableTableLists(storeID);
    var context = {
        pageTitle: '테이블 선택',
        storeID: storeID,
        result: result
    }
    res.render('tableSelect', context);
});
//테이블 선택 확인 페이지
router.get("/:storeID/tableSelect/:tableNumber", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.userstableExistMiddleware, storeModel.takenTableMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var tableNumber = String(req.params.tableNumber);
    var context = {
        pageTitle: '테이블 선택 확인',
        storeID: storeID,
        tableNumber: tableNumber
    }
    res.render('tableSelectConfirm', context);
});
//테이블 정하기 post 요청
router.post("/:storeID/tableSelect/:tableNumber", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.userstableExistMiddleware, storeModel.takenTableMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var tableNumber = String(req.params.tableNumber);
        let result = await storeModel.postNewTable(storeID, tableNumber, req);
        if (result == false) {
            throw new Error('Posting New Table Failed!')
        }
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tableSelect`)
    }
});
//테이블 정산 or 전체 삭제 post 요청 //admin만 가능한 Middleware // 생성시 storeInfo.tableLists와 order.didPay: true와 userSchema.tableNumber가 입력되었으니 삭제 //didPay: true로

//테이블 현재 주문 상태 페이지
router.get("/:storeID/tables/:tableNumber", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.tableLeaderMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var tableNumber = String(req.params.tableNumber);
        if (req.user.hasOwnProperty('admin') && req.user.admin === true) {
            var admin = true
        } else {
            var admin = false
        }
        var result = await storeModel.getTableInfo(storeID, tableNumber);
        if (result == false) {
            throw new Error('There is no table!')
        }
        if (result.orders == undefined) {
            var context = {
                pageTitle: '현재 주문',
                storeID: storeID,
                tableNumber: tableNumber,
                result: result,
                admin: admin
            }
            res.render('tableCurrentOrder', context);
            return;
        } else if (result.orders !== undefined) {
            let calculateResult = storeModel.calculateSumAndCount(result)
            var context = {
                pageTitle: '현재 주문',
                storeID: storeID,
                tableNumber: tableNumber,
                result: result,
                sum: calculateResult.sum,
                allCount: calculateResult.allCount,
                admin: admin
            }
            res.render('tableCurrentOrder', context);
            return;
        } else {
            res.redirect(`/stores/${storeID}/tableSelect`)
        }
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tableSelect`)
    }
});
//테이블 메뉴판
router.get("/:storeID/tables/:tableNumber/menus", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.tableLeaderMiddleware, async (req, res, next) => {
    var storeID = String(req.params.storeID);
    var tableNumber = String(req.params.tableNumber);
    var result = await infoModel.getStoreMenus(storeID);
    var context = {
        pageTitle: '메뉴판',
        storeID: storeID,
        tableNumber: tableNumber,
        result: result.result,
        arrayResult: result.arrayResult
    }
    res.render('tableMenu', context);
});
//테이블 메뉴 추가 확인
// router.get("/:storeID/tables/:tableNumber/menus/:menuName/confirm", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.tableLeaderMiddleware, async (req, res, next) => {
//     var storeID = String(req.params.storeID);
//     var tableNumber = String(req.params.tableNumber);
//     var menuName = String(req.params.menuName);
//     var context = {
//         pageTitle: '메뉴 추가 확실해요?',
//         storeID: storeID,
//         tableNumber: tableNumber,
//         menuName: menuName,
//         result: result
//     }
//     res.render('tableMenuConfirm', context);
// });
//테이블 메뉴 주문 post 요청
router.post("/:storeID/tables/:tableNumber/menus/:menuName", storeModel.validStoreName, userModel.logInCheckMiddleware, storeModel.tableLeaderMiddleware, storeModel.menuValidationMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var tableNumber = String(req.params.tableNumber);
        var menuName = String(req.params.menuName);
        let result = await storeModel.postNewDish(storeID, tableNumber, menuName, req);
        if (result == false) {
            throw new Error('Posting New Dish Failed!')
        }
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    }
});
//테이블 어드민 메뉴 수정 페이지 get 요청
router.get("/:storeID/tables/:tableNumber/menus/:menuName/modifyPage", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.isAdminMiddleware, storeModel.menuValidationMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        var tableNumber = String(req.params.tableNumber);
        var menuName = String(req.params.menuName);
        let result = storeModel.getTableInfo(storeID, tableNumber)
        if (result == false) {
            throw new Error('Getting Order Info Failed!')
        }
        var foundTableOrderCount = result.orders.find(e => e.name === `${menuName}`).count
        let context = {
            pageTitle: '메뉴 수정',
            storeID: storeID,
            tableNumber: tableNumber,
            menuName: menuName,
            result: result,
            foundTableOrderCount: foundTableOrderCount
        }
        res.render('tableOrderModify', context);
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    }
});

//테이블 어드민 메뉴 수정 post 요청
router.post("/:storeID/tables/:tableNumber/menus/:menuName/modify", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.isAdminMiddleware, storeModel.menuValidationMiddleware, async (req, res, next) => {
    try {
        let result = storeModel.updateDish(storeID, tableNumber, menuName, req)
        if (result == false) {
            throw new Error('Updating Dish Failed!')
        }
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    }
});

//테이블 어드민 메뉴 삭제 post 요청
router.get("/:storeID/tables/:tableNumber/menus/:menuName/delete", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.isAdminMiddleware, storeModel.menuValidationMiddleware, async (req, res, next) => {
    try {
        let result = storeModel.deleteDish(storeID, tableNumber, menuName, req)
        if (result == false) {
            throw new Error('Deleting Dish Failed!')
        }
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    } catch (e) {
        console.log(e)
        res.redirect(`/stores/${storeID}/tables/${tableNumber}`)
    }
});



//테이블 어드민 페이지
router.get("/:storeID/admin/tableStatus", storeModel.validStoreName, userModel.logInCheckMiddleware, userModel.isAdminMiddleware, async (req, res, next) => {
    try {
        var storeID = String(req.params.storeID);
        let result = await storeModel.getTableStatus(storeID);
        if (result == false) {
            throw new Error('Getting Table Status Failed!')
        }
        let context = {
            storeID: storeID,
            result: result
        }
        res.render('adminTableStatus', context)
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
});



module.exports = router;
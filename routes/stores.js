const { Router } = require('express');
const router = Router();
const passport = require('passport');
const express = require("express");
const app = express();
const userModel = require('../models/user');
const storeModel = require('../models/store');



app.use(passport.session());



//store의 메인 페이지
router.get("/:storeID", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    const context = {
        pageTitle: storeID,
        storeID: storeID,
    };
    res.render('store', context);
});



//store의 자유게시판 글 목록
router.get("/:storeID/freeBoards/pages/:pages", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let pages = String(req.params.pages);
    let freeBoardListsResult = await storeModel.getFreeBoardLists(storeID, pages);
    const context = {
        pageTitle: storeID,
        storeID: storeID,
        freeBoardListsResult: freeBoardListsResult
    };
    res.render('freeBoardLists', context);
});



//store의 자유게시판의 글 읽기
router.get("/:storeID/freeBoards/posts/:postID", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await storeModel.getFreeBoardPost(postID);
    let context = {
        result: result,
        storeID: storeID,
        postID: postID,
        req: req
    }
    res.render('freeBoardRead', context);
});
//store의 자유게시판의 글 작성 페이지
router.get("/:storeID/freeBoards/write", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let context = {
        pageTitle: '게시글 작성',
        storeID: storeID
    };
    res.render('freeBoardWrite', context);
});
//store의 자유게시판의 글 수정 페이지
router.get("/:storeID/freeBoards/posts/:postID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await storeModel.getFreeBoardPost(postID);
    let context = {
        pageTitle: '게시글 수정',
        storeID: storeID,
        postID: postID,
        result: result
    };
    res.render('freeBoardModify', context);
});
//store의 자유게시판의 글 작성 post 요청
router.post('/:storeID/freeBoards/write', userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let result = await storeModel.postFreeBoardPost(storeID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${result._id}`);
});
//store의 자유게시판의 글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/hearts', userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.postFreeBoardPostHeart(storeID, postID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 글 수정 update 요청
router.get('/:storeID/freeBoards/posts/:postID/modify', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.updateFreeBoardPost(storeID, postID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 글 삭제 delete 요청
router.get('/:storeID/freeBoards/posts/:postID/delete', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.deleteFreeBoardPost(storeID, postID, req);
    res.redirect(`/stores/${storeID}/freeBoards/pages/1`);
});



//store의 자유게시판의 댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/write", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.postFreeBoardComment(storeID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 댓글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/commentHearts', userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.postFreeBoardPostHeart(storeID, postID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 댓글 수정 update 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await storeModel.updateFreeBoardComment(storeID, postID, commentID, req);
    res.json(result);
});
//store의 자유게시판의 댓글 삭제 delete 요청
router.get("/:storeID/freeBoards/posts/:postID/comments/:commentID/delete", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await storeModel.deleteFreeBoardComment(storeID, postID, commentID);
    res.json(result);
});



//store의 자유게시판의 대댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/comments/:commentID/write", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await storeModel.postFreeBoardReComment(storeID, postID, commentID, req);
    res.json(result);
});
//store의 자유게시판의 대댓글 좋아요 post 요청
router.post('/:storeID/freeBoards/posts/:postID/comments/:commentID/reCommentHearts', userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    await storeModel.postFreeBoardPostHeart(storeID, postID, req);
    res.redirect(`/stores/${storeID}/freeBoards/posts/${postID}`);
});
//store의 자유게시판의 대댓글 수정 update 요청
router.put("/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let recommentID = String(req.params.recommentID);
    let result = await storeModel.updateFreeBoardReComment(storeID, postID, commentID, recommentID, req);
    res.json(result);
});
//store의 자유게시판의 대댓글 삭제 delete 요청
router.delete("/:storeID/freeBoards/posts/:postID/comments/:commentID/recomments/:recommentID/delete", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let recommentID = String(req.params.recommentID);
    let result = await storeModel.deleteFreeBoardReComment(storeID, postID, commentID, recommentID);
    res.json(result);
});

    

//store의 신청곡 글 목록
router.get("/:storeID/songRequests/pages/:pages", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let pages = String(req.params.pages);
    let result = await storeModel.getSongRequestLists(storeID, pages);
    res.json(result);
});



//store의 신청곡 글 작성 post 요청
router.post('/:storeID/songRequests/write', userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let result = await storeModel.postSongRequests(storeID, req);
    res.json(result);
});
//store의 신청곡 글 수정 update 요청
router.put('/:storeID/songRequests/posts/:postID/modify', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await storeModel.updateSongRequests(storeID, postID, req);
    res.json(result);
});
//store의 신청곡 글 삭제 delete 요청
router.delete('/:storeID/songRequests/posts/:postID/delete', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let postID = String(req.params.postID);
    let result = await storeModel.deleteSongRequests(storeID, postID, req);
    res.json(result);
});




router.get("/:storeID/orders", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let result = await storeModel.getMenus(storeID);
    res.json(result);
});



module.exports = router;
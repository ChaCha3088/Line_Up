const { Router } = require('express');
const router = Router();
const path = require('path');
const passport = require('passport');
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const userModel = require('../models/user');
const storeModel = require('../models/store');



app.use(passport.session());



//store의 메인 페이지
router.get("/:storeID", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    res.sendFile('/Users/mac/Desktop/last/public/AAA/stores.html');
});



//store의 자유게시판 글 목록
router.get("/:storeID/freeBoards/pages/:pages", userModel.logInCheckMiddleware, async (req, res, next) => {
    res.sendFile('/Users/mac/Desktop/last/public/AAA/stores.html')
    let pages = String(req.params.pages);
    let storeID = String(req.params.storeID);
    let result = await storeModel.getFreeBoardLists(storeID, pages);
    res.json(result);
});



//store의 자유게시판의 글 읽기
router.get("/:storeID/freeBoards/posts/:postID", userModel.logInCheckMiddleware, async (req, res, next) => {
    let postID = String(req.params.postID);
    let result = await storeModel.getFreeBoardPost(postID);
    res.json(result);
});
//store의 자유게시판의 글 작성 페이지
router.get("/:storeID/freeBoards/posts/write", userModel.logInCheckMiddleware, async (req, res, next) => {
    res.sendFile('/Users/mac/Desktop/last/public/AAA/write.html');
});
//store의 자유게시판의 글 수정 페이지
router.get("/:storeID/freeBoards/posts/:postID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let postID = String(req.params.postID);
    let result = await storeModel.getFreeBoardPost(postID);
    res.json(result);
    res.sendFile('/Users/mac/Desktop/last/public/modify.html');
});
//store의 자유게시판의 글 작성 post 요청
router.post('/:storeID/freeBoards/posts/write', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let result = await storeModel.postFreeBoardPost(storeID, req);
    res.json(result);
});
//store의 자유게시판의 글 수정 update 요청
router.put('/:storeID/freeBoards/posts/:postID/modify', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await storeModel.updateFreeBoardPost(storeID, postID, req);
    res.json(result);
});
//store의 자유게시판의 글 삭제 delete 요청
router.delete('/:storeID/freeBoards/posts/:postID/delete', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await storeModel.deleteFreeBoardPost(storeID, postID, req);
    res.json(result);
});



//store의 자유게시판의 댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/comment/write", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let result = await postFreeBoardComment(storeID, postID, req);
    res.json(result);
});
//store의 자유게시판의 댓글 수정 put 요청
router.put("/:storeID/freeBoards/posts/:postID/comment/:commentID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await updateFreeBoardComment(storeID, postID, commentID, req);
    res.json(result);
});
//store의 자유게시판의 댓글 삭제 delete 요청
router.delete("/:storeID/freeBoards/posts/:postID/comment/:commentID/delete", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await deleteFreeBoardComment(storeID, postID, commentID);
    res.json(result);
});



//store의 자유게시판의 대댓글 작성 post 요청
router.post("/:storeID/freeBoards/posts/:postID/comment/:commentID/recomment/:recommentID/write", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let result = await postFreeBoardReComment(storeID, postID, commentID, req);
    res.json(result);
});
//store의 자유게시판의 대댓글 수정 put 요청
router.put("/:storeID/freeBoards/posts/:postID/comment/:commentID/recomment/:recommentID/modify", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let recommentID = String(req.params.recommentID);
    let result = await updateFreeBoardReComment(storeID, postID, commentID, recommentID, req);
    res.json(result);
});
//store의 자유게시판의 대댓글 삭제 delete 요청
router.delete("/:storeID/freeBoards/posts/:postID/comment/:commentID/recomment/:recommentID/delete", userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let postID = String(req.params.postID);
    let commentID = String(req.params.commentID);
    let recommentID = String(req.params.recommentID);
    let result = await deleteFreeBoardReComment(storeID, postID, commentID, recommentID);
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
router.post('/:storeID/songRequests/posts/write', userModel.logInCheckMiddleware, userModel.authorCheckMiddleware, async (req, res, next) => {
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
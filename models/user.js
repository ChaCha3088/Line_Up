const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
const Sessions = require('../models/schemas/session');
const freeBoard = require('../models/schemas/Board/freeBoard/freeBoard');

const backURL = function(req) {
    if (req.session.backURL) {
        res.redirect(req.session.backURL);
    } else {
        res.redirect('back');
    }
}

const checkReqUserKakaoAccessToken = function(req) {
    try {
        let a = req.user.kakaoAccessToken;
        if(!a) {
            throw new Error('클라이언트에 kakaoAccessToken이 없음');
        } else {
            return a;
        }
    } catch (e) {
        return;
    }
}

const checkReqUserID = function(req) {
    try {
        let a = req.user.ID;
        if(!a) {
            throw new Error('클라이언트에 ID가 없음');
        } else {
            return a;
        }
    } catch (e) {
        return;
    }
}

const findUserInSessionsWithUserID = async function(req) {
    try {
        let a = req.user.ID;
        if (!a) {
            throw new Error('클라이언트에 ID 없음');
        }
        let result = await Sessions.findOne({'session.passport.user.ID': `${a}`}).exec();
        if (!result) {
            throw new Error('세션 서버에 클라이언트의 kakaoAccessToken와 일치하는 user가 없음');
        } else {
            let userKakaoAccessTokenInSessions = result.session.passport.user.kakaoAccessToken;
            return {
                result: result,
                userKakaoAccessTokenInSessions: userKakaoAccessTokenInSessions
            };
        }
    } catch (e) {
        return;
    }
}

const findUserInFreeBoardWithUserID = async function(req) {
    try {
        let storeID = String(req.params.storeID);
        let postID = String(req.params.postID);
        let a = req.user.ID;
        if (!a || !storeID || !postID) {
            throw new Error('클라이언트에 충분한 정보가 없음');
        }
        let result = await freeBoard.findOne({
            'ID': `${a}`,
            'storeID': storeID,
            'postID': postID
        }).exec();
        if (!result) {
            throw new Error('freeBoard에 클라이언트의 ID, storeID, postID와 일치하는 게시물이 없음');
        } else if (result.ID == a && result.ID !== undefined && a!== undefined) {
            return result.ID;
        } else {
            throw new Error('게시글의 작성자와 요청자의 ID가 다르거나 undefined가 있음');
        }
    } catch (e) {
        return;
    }
}

module.exports = {
    backURL: backURL,
    checkReqUserKakaoAccessToken: checkReqUserKakaoAccessToken,
    checkReqUserID: checkReqUserID,
    findUserInSessionsWithUserID: findUserInSessionsWithUserID,
    findUserInFreeBoardWithUserID: findUserInFreeBoardWithUserID,

    logInCheckMiddleware: async function(req, res, next) {
        try {
            let reqUserID = checkReqUserID(req);
            let result = await findUserInSessionsWithUserID(req);
            if (!result) {
                console.log('You are not loggined.');
                req.session.destroy();
                res.clearCookie('connect.sid');
                res.redirect('/');
                return;
            }
            if (reqUserKakaoAccessToken == result.userKakaoAccessTokenInSessions && reqUserKakaoAccessToken && result.userKakaoAccessTokenInSessions) {
                console.log(`You are ${result.result.session.passport.user.userName}`);
                console.log(`You are good to go!`);
                next();
            } else {
                console.log('You are not loggined.');
                req.session.destroy();
                res.clearCookie('connect.sid');
                res.redirect('/');
                return;
            }
        }
        catch (e) {
            console.log('You are not loggined.');
            console.log(e);
            req.session.destroy();
            res.clearCookie('connect.sid');
            res.redirect('/');
            return;
        }
    },

    alreadyLogInCheckMiddleware: async function(req, res, next) {
        try {
            let reqUserKakaoAccessToken = checkReqUserKakaoAccessToken(req);
            let result = await findUserInSessionsWithUserID(req);
            if (!result) {
                next();
                return;
            }
            if (reqUserKakaoAccessToken == result.userKakaoAccessTokenInSessions && reqUserKakaoAccessToken && result.userKakaoAccessTokenInSessions) {
                console.log(`You are ${result.result.session.passport.user.userName}`);
                console.log('You are already loggined.');
                res.redirect('/');
                return;
            } else {
                next();
            }
        }
        catch (e) {
            console.log(e);
            res.redirect('/');
            return;
        }
    },

    authorCheckMiddleware: async function(req, res, next) {
        try {
            let reqUserKakaoAccessToken = checkReqUserKakaoAccessToken(req);
            let result = await findUserInFreeBoardWithUserID(req);
            if (!result) {
                console.log('You are not the author of this one.');
                backURL();
                return;
            }
            if (result) {
                console.log(`You are ${result}`);
                console.log(`You are good to go!`);
                next();
            } else {
                console.log('You are not the author of this one.');
                backURL();
                return;
            }
        }
        catch (e) {
            console.log('You are not the author of this one.');
            console.log(e);
            backURL();
            return;
        }
    },
}
const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
const Sessions = require('../models/schemas/session');

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

const findUserInSessionsWithUserID = async function(req) {
    try {
        let a = req.user.ID;
        if (!a) {
            throw new Error('클라이언트에 ID 없음');
        }
        let result = await Sessions.findOne({'session.passport.user.ID': `${req.user.ID}`}).exec();
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

module.exports = {
    checkReqUserKakaoAccessToken: checkReqUserKakaoAccessToken,
    findUserInSessionsWithUserID: findUserInSessionsWithUserID,

    logInCheckMiddleware: async function(req, res, next) {
        try {
            let reqUserKakaoAccessToken = checkReqUserKakaoAccessToken(req);
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
    }
}
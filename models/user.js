const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
const Sessions = require('../models/schemas/session');
const freeBoard = require('./schemas/Board/freeBoard/freeBoard');
const crypto = require('crypto');

const checkReqSessionID = function(req) {
    try {
        let a = req.sessionID;
        if(!a) {
            throw new Error('req에 sessionID가 없음');
        } else {
            return a;
        }
    } catch (e) {
        return;
    }
}

const checkReqUserEmail = function(req) {
    try {
        let a = req.user.email;
        if(!a) {
            throw new Error('클라이언트에 ID가 없음');
        } else {
            return a;
        }
    } catch (e) {
        return;
    }
}

const findUserInSessionsWithSessionID = async function(req) {
    try {
        let a = req.sessionID;
        if (!a) {
            throw new Error('req에 sessionID가 없음');
        }
        let result = await Sessions.findOne({'_id': `${a}`}).exec();
        if (!result) {
            throw new Error('세션 서버에 req.sessionID와 일치하는 user가 없음');
        } else {
            let sessionServerSessionID = result._id;
            let email = result.session.passport.user.email;
            return {
                result: result,
                email: email,
                sessionServerSessionID: sessionServerSessionID
            };
        }
    } catch (e) {
        return;
    }
}

const findUserInFreeBoardWithEmail = async function(req) {
    try {
        let storeID = String(req.params.storeID);
        let postID = String(req.params.postID);
        let email = req.user.email;
        if (!email || !storeID || !postID) {
            throw new Error('클라이언트에 충분한 정보가 없음');
        }
        let result = await freeBoard.findOne({
            'storeID': storeID,
            '_id': postID
        }).exec();
        if (!result) {
            throw new Error('freeBoard에 클라이언트의 email, storeID, postID와 일치하는 게시물이 없음');
        } else if (result.email == email && result.email !== undefined && email!== undefined) {
            return result.email;
        } else {
            throw new Error('게시글의 작성자와 요청자의 email이 다르거나 undefined가 있음');
        }
    } catch (e) {
        return;
    }
}

module.exports = {
    checkReqSessionID: checkReqSessionID,
    checkReqUserEmail: checkReqUserEmail,
    findUserInSessionsWithSessionID: findUserInSessionsWithSessionID,
    findUserInFreeBoardWithEmail: findUserInFreeBoardWithEmail,

    // 사용자가 입력한 패스워드를 해쉬로 만들어서 비교하여 해당 패스워드가 맞는지 확인하는 함수
    validPassword: function(password, hash, salt) {
        const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === hashVerify;
    },

    // 사용자가 입력한 패스워드에 랜덤한 salt를 대입하여 해쉬를 만들어 반환
    genPassword: function(password) {
        const salt = crypto.randomBytes(32).toString('hex');
        const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        return {
            salt: salt,
            hash: genHash
        }
    },

    userInfo: function(req) {
        try {
            return req.user;
        } catch {
            return;
        }
    },

    isLogIned: async function(req, res) {
        try {
            let reqUserEmail = checkReqUserEmail(req);
            let result = await findUserInSessionsWithSessionID(req);
            if (!result) {
                console.log('You are not loggined.');
                return {
                    result: 0,
                };
            }
            if (reqUserEmail == result.email && reqUserEmail !== undefined && result.email !== undefined ) {
                console.log(`You are ${result.result.session.passport.user.userName}`);
                console.log(`You are good to go!`);
                return {
                    result: 1,
                    userName: result.result.session.passport.user.userName
                };
            } else {
                console.log('You are not loggined.');
                return {
                    result: 0,
                };
            }
        }
        catch (e) {
            console.log('You are not loggined.');
                return {
                    result: 0,
                };
        }
    },

    logInCheckMiddleware: async function(req, res, next) {
        try {
            let reqSessionID = checkReqSessionID(req);
            let result = await findUserInSessionsWithSessionID(req);
            if (!result) {
                console.log('You are not loggined.');
                req.session.destroy();
                res.clearCookie('connect.sid');
                res.redirect('/');
                return;
            }
            if (reqSessionID == result.sessionServerSessionID && reqSessionID !== undefined && result.sessionServerSessionID !== undefined ) {
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
            let reqSessionID = checkReqSessionID(req);
            let result = await findUserInSessionsWithSessionID(req);
            if (!result) {
                next();
                return;
            }
            if (reqSessionID == result.sessionServerSessionID && reqSessionID !== undefined && result.sessionServerSessionID !== undefined) {
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
            let reqUserEmail = checkReqUserEmail(req);
            let result = await findUserInFreeBoardWithEmail(req);
            if (reqUserEmail !== result) {
                console.log('You are not the author of this one.');
                console.log(req.session.back)
                res.redirect('back');
                return;
            }
            if (result == reqUserEmail && result !== undefined && reqUserEmail !== undefined) {
                console.log(`You are ${result}`);
                console.log(`You are good to go!`);
                next();
            } else {
                console.log('You are not the author of this one.');
                res.redirect('back');
                return;
            }
        }
        catch (e) {
            console.log('You are not the author of this one.');
            console.log(e);
            res.redirect('back');
            return;
        }
    },
}
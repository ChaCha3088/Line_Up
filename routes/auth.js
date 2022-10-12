const path = require('path');
require("dotenv").config({path: path.join(__dirname, '/.env')});

const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const axios = require('axios');
const UserSchema = require('../models/schemas/auth');
const Sessions = require('../models/schemas/session');
const userModel = require('../models/user');

app.use(passport.session());

router.get('/kakao', userModel.alreadyLogInCheckMiddleware, passport.authenticate('kakao'));
// 로그인 했는지 확인 먼저

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
}), (req, res) => {
    res.redirect('/');
});

router.get('/kakao/logout', userModel.logInCheckMiddleware , async (req, res, next) => {
    try {
        let filter = { ID:`${req.session.passport.user.ID}` };
        let update = { kakaoAccessToken: '' };

        let result = await UserSchema.findOne(filter).exec();
        let kakaoAccessToken = result.kakaoAccessToken;

        //userdb의 토큰 지워주고
        await UserSchema.findOneAndUpdate(filter, update).exec();

        //sessiondb를 지워주고
        let deletedCount = await Sessions.deleteMany( { 'session.passport.user.ID': req.session.passport.user.ID } );
        console.log(`필요없는 세션의 개수는 ${deletedCount.deletedCount}`)

        //카카오 서버에 로그아웃 포스트 요청
        let postAxios = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/user/logout',
            headers:{
              'Authorization': `Bearer ${kakaoAccessToken}`
            }
          });

        let postResult = postAxios.data.id;
        if (req.session.passport.user.ID == postResult) {
            console.log(`kakao server said "${req.user.userName} can Logout now!"`);
        } else {
            console.log('카카오 서버 로그아웃 문제 발생!');
        }

        // 세션 정리
        req.logout((err) => {
            if (err) {
                req.session.destroy();
                res.clearCookie('connect.sid');
                res.redirect("/");
            } else {
                req.session.destroy();
                res.clearCookie('connect.sid');
                res.redirect('/');
            }
        });

    } catch (error) {
        console.error(error);
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.redirect('/');
    }
});



module.exports = router;
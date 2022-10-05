const path = require('path');
require("dotenv").config({path: path.join(__dirname, '/.env')});

const express = require('express');
const router = express.Router();
const passportreq = require('passport');
const session = require('express-session');
const axios = require('axios');
const UserSchema = require('../models/schemas/auth');
const Sessions = require('../models/schemas/session');
const userModel = require('../models/user');

router.use(passportreq.session());

router.get('/kakao', userModel.alreadyLogined, passportreq.authenticate('kakao'));
// 로그인 했는지 확인 먼저

router.get('/kakao/callback', passportreq.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
}), (req, res) => {
    res.redirect('/');
});

router.get('/kakao/logout', userModel.loginRequired, async (req, res, next)=>{
    // https://kapi.kakao/com/v1/user/logout
    try {
        //로그인 했는지 확인 먼저
        
        const filter = {ID:`${req.user.ID}`};
        const update = { accessToken: '' };

        const result = await UserSchema.findOne(filter).exec();
        const accessToken = result.accessToken;

        await UserSchema.findOneAndUpdate(filter, update).exec();
        //userdb의 토큰 지워주고

        await Sessions.findOneAndDelete({'passport.user.ID': `${req.user.ID}`}).exec();
        // console.log(`results is ${results}`);
        // const objData = JSON.parse(results.session);
        // console.log(`ojbData is ${objData.passport.user.ID}`);
        //sessiondb를 지워주고

        let logout = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/user/logout',
            headers:{
            'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
    // 세션 정리
    req.logout((err) => {
        req.session.destroy();
        if (err) {
            res.redirect("/");
        } else {
            console.log('로그아웃 완료');
            res.clearCookie('connect.sid');
            res.redirect('/');
        }
	});
});



module.exports = router;
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

router.get('/kakao', userModel.alreadyLogined, passport.authenticate('kakao'));
// 로그인 했는지 확인 먼저

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
}), (req, res) => {
    res.redirect('/');
});

router.get('/kakao/logout', userModel.loginRequired, async (req, res, next)=>{
    // https://kapi.kakao/com/v1/user/logout
    try {
        //로그인 했는지 확인 먼저

         //Session {
            //   cookie: {
            //     path: '/',
            //     _expires: 2022-10-09T10:38:08.776Z,
            //     originalMaxAge: 86400000,
            //     httpOnly: true
            //   },
            //   passport: {
            //     user: {
            //       ID: '2467587254',
            //       userName: 'Cha Cha',
            //       kakaoAccessToken: 'CMkCNfAicOCmn9zU0Mh9hpR99TiXQUQ_Dp0uVukbCilwUAAAAYO3LHj9',
            //       _id: '63415310fea1abf9c14c9bcf',
            //       createdAt: '2022-10-08T10:38:08.762Z',
            //       updatedAt: '2022-10-08T10:38:08.762Z',
            //       __v: 0
            //     }
            //   }
            // }

        
        const filter = {ID:`${req.session.passport.user.ID}`};
        const update = { kakaoAccessToken: '' };

        const result = await UserSchema.findOne(filter).exec();
        console.log(`req.session.passport.user.ID is ${req.session.passport.user.ID}`);
        console.log(result);
        const kakaoAccessToken = result.kakaoAccessToken;

        await UserSchema.findOneAndUpdate(filter, update).exec();
        //userdb의 토큰 지워주고

        await Sessions.findOneAndDelete({'passport.user.ID': `${req.session.passport.user.ID}`}).exec();
        // console.log(`results is ${results}`);
        // const objData = JSON.parse(results.session);
        // console.log(`ojbData is ${objData.passport.user.ID}`);
        //sessiondb를 지워주고

        let postAxios = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/user/logout',
            headers:{
              'Authorization': `Bearer ${kakaoAccessToken}`
            }
          });

        let postResult = postAxios.data.id;
        if (req.session.passport.user.ID == postResult) {
            console.log(`kakao server said "You can Logout now!"`);
        }

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
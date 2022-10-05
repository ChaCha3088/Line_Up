const path = require('path');
require("dotenv").config({path: path.join(__dirname, '/.env')});

const express = require('express');
const router = express.Router();
const passportreq = require('passport');
const session = require('express-session');
const axios = require('axios');
const UserSchema = require('../models/schemas/auth');
const Sessions = require('../models/schemas/session');

router.use(passportreq.session());

router.get('/kakao', passportreq.authenticate('kakao'));
// 로그인 했는지 확인 먼저

router.get('/kakao/callback', passportreq.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
}), (req, res) => {
    res.redirect('/');
});

router.get('/kakao/logout', async (req, res)=>{
    // https://kapi.kakao/com/v1/user/logout
    try {
        const filter = {ID:`${req.user.ID}`};
        const update = { accessToken: '' };
        await UserSchema.findOneAndUpdate(filter, update).exec();
        //userdb의 토큰 지워주고

        const results = await Sessions.findOne({'passport.user.ID': `${req.user.ID}`}).exec();
        console.log(`results is ${results}`);
        const objData = JSON.parse(results.session);
        console.log(`ojbData is ${objData.passport.user.ID}`);
        //sessiondb를 지워주고

        // {
        //     _id: 'Q4YFDnt5qsyB5XcJxDz4a0wrei41m3El',
        //     expires: 2022-10-05T03:43:01.888Z,
        //     session: '{"cookie":{"originalMaxAge":86400000,"expires":"2022-10-05T03:43:01.888Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":{"_id":"633aa2f3f56fdba4de9fec0a","ID":"2467587254","userName":"Cha Cha","accessToken":"6yE953NczgTVVQcrKU9V8Wbem3f4y3dEpkbm9w-GCinJXwAAAYOdDIae","createdAt":"2022-10-03T08:53:07.322Z","updatedAt":"2022-10-03T08:53:07.322Z","__v":0,"admin":"true"}}}'
        //   }
          

        const accessToken = UserSchema.findOne(filter, update).exec();
        // let logout = await axios({
        //     method:'post',
        //     url:'https://kapi.kakao.com/v1/user/logout',
        //     headers:{
        //     'Authorization': `Bearer ${accessToken}`
        //     }
        // });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
    // 세션 정리
    req.logout();
    req.session.destroy();

    res.redirect('/');
  });



module.exports = router;
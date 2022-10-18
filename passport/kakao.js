// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;
// const mongoose = require('mongoose');
// const UserSchema = require('../models/schemas/user');
// const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
// let Sessions = require('../models/schemas/session');
// const userModel = require('../models/user');

// module.exports = () => {
//     passport.use('kakao',
//         new KakaoStrategy({
//             clientID: process.env.restAPI, // 카카오 로그인에서 발급받은 REST API 키
//             callbackURL: process.env.redirectURI, // 카카오 로그인 Redirect URI 경로
//         },
//         // clientID에 카카오 앱 아이디 추가
//         // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
//         // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
//         // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
//         async (kakaoAccessToken, refreshToken, profile, done) => {
//             try {
//                 let query = { 'ID': profile.id };
//                 let exUser = await UserSchema.findOne(query);

//                 // 이미 가입된 카카오 프로필이면 성공
//                 if (exUser) {
//                     console.log(`User in UserSchema!, and name is ${profile.username}!`);
//                     exUser.kakaoAccessToken = kakaoAccessToken;
//                     await UserSchema.findOneAndUpdate(
//                         { 'ID': profile.id },
//                         { 'kakaoAccessToken': kakaoAccessToken }
//                         ).exec();
                    
//                     //Sessions에서 profile.id로 검색해서 kakaoAccessToken과 일치하지 않는 것은 다 지워
//                     let deletedCount = await Sessions.deleteMany( { 'session.passport.user.ID': `${profile.id }`} ).exec();
//                     console.log(`필요없는 세션의 개수는 ${deletedCount.deletedCount}개`);
//                     done(null, exUser); // 로그인 인증 완료

//                 } else {
//                     // UserSchema에 없으면 회원가입 시키고 로그인을 시킨다
//                     console.log(`Created New User, and name is ${profile.username}!`);
//                     let newUser = await UserSchema.create({
//                         ID: profile.id,
//                         userName: profile.username,
//                         kakaoAccessToken: kakaoAccessToken,
//                     });
//                     done(null, newUser); // 회원가입하고 로그인 인증 완료
//                 }
//             } catch (e) {
//                 console.error(e);
//                 done(null, false);
//             }
//         },
//         ),
//     );

//     passport.serializeUser((user, done) => {
//         done(null, user);
//     });

//     passport.deserializeUser(async (user, done) => {
//         try {
//             let reqUserKakaoAccessToken = user.kakaoAccessToken;
//             let result = await Sessions.findOne({'session.passport.user.kakaoAccessToken': `${reqUserKakaoAccessToken}`}).exec();
//             let userKakaoAccessTokenInSessions = result.session.passport.user.kakaoAccessToken;
//             if (reqUserKakaoAccessToken == userKakaoAccessTokenInSessions && reqUserKakaoAccessToken && userKakaoAccessTokenInSessions) {
//                 done(null, user);
//             } else {
//                 done(null, false);
//             }
//         }
//         catch (e) {
//             done(null, false);
//         }
//     })
// }



//         // try {
//         //     let SessionsResult = await Sessions.findOne({'session.passport.user.ID': `${user.ID}`}).exec();
//         //     let SessionsKakaoAccessToken = SessionsResult.session.passport.user.kakaoAccessToken;
//         //     let userResult = user.kakaoAccessToken;
//         //     console.log(`SessionsResult, userResult`);
//         //     console.log(`${SessionsKakaoAccessToken}, ${userResult}`);
//         //     if (SessionsKakaoAccessToken == userResult) {
//         //         console.log(`accessAuth is Success!`);
//         //         return done(null, user);
//         //     } else {
//         //         console.log(`SessionsResult, userResult are different`);
//         //         console.log(`accessAuth is Fail!`);
//         //         //로컬 쿠키를 지우고, 다시 로그인하게끔
//         //         return done(null, false);
//         //     }} catch {
//         //         console.log(`accessAuth is Fail!`);
//         //         //로컬 쿠키를 지우고, 다시 로그인하게끔
//         //         return done(null, false);
//         //     }
//         // });
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const UserSchema = require('../models/schemas/user');
const UserHistory = require('../models/schemas/Board/userHistory');
let Sessions = require('../models/schemas/session');
const userModel = require('../models/user');
const crypto = require('crypto');

module.exports = () => {
    passport.use('login', 
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "pw",
                passReqToCallback: true,
            },
        
        async (req, email, pw, done) => {
            try {
                let query = { 'email': email };
                let exUser = await UserSchema.findOne(query);
                
                // 이미 가입된 프로필이면 패스워드 체크
                if (exUser) {
                    const isValid = userModel.validPassword(pw, exUser.hash, exUser.salt);

                    if (isValid) {
                        console.log(`You are the member! Your name is ${exUser.userName}!`);
                        
                        //Sessions에서 email로 검색해서 전부 지워
                        let deletedCount = await Sessions.deleteMany( { 'session.passport.user.email': `${exUser.email}`} ).exec();
                        console.log(`필요없는 세션의 개수는 ${deletedCount.deletedCount}개`);

                        done(null, exUser); // 로그인 인증 완료
                    } else {
                        // 로그인 실패
                        throw Error(`Your password is not right!`);
                    }
                } else {
                    // 로그인 실패
                    throw Error(`Your email is not in our database!`);
                }
            } catch (e) {
                console.error(e);
                done(null, false);
            }
        },
        ),
    );

    passport.use('signup', 
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "pw",
                passReqToCallback: true
            },
        
        async (req, email, pw, done) => {
            try {
                if (pw !== req.body.pwAgain) {
                    throw Error('Passwords are not matched!');
                }
                let query = { 'email': email };
                let exUser = await UserSchema.findOne(query);
                
                if (exUser == null) {
                    console.log('There is no exUser, Creating newUser');
                    let genedPassword = userModel.genPassword(pw);
                    await UserSchema.create({
                        'userName': req.body.userName,
                        'email': email,
                        'salt': genedPassword.salt,
                        'hash': genedPassword.hash
                    });

                    let userHistoryResult = await UserHistory.create(
                        {
                            '_id': mongoose.Types.ObjectId(),
                            'userName': req.body.userName,
                            'email': email,
                        }
                    );

                    let newUser = {
                        'userName': req.body.userName,
                        'email': email,
                        'salt': genedPassword.salt,
                        'hash': genedPassword.hash
                    }

                    done(null, newUser);
                } else if (exUser) {
                    throw Error('Your email is already in our database!');
                }
                done(null, false);
            } catch (e) {
                console.error(e);
                done(null, false);
            }
        },
        ),
    );

}
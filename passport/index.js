let Sessions = require('../models/schemas/session');
const passport = require('passport')
const kakao = require('./kakao');
const local = require('./local');
const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser');
        done(null, user);
    });

    passport.deserializeUser(async (req, user, done) => {
        try {
            let result = await Sessions.findOne({'_id': `${req.sessionID}`}).exec();
            if (result) {
                console.log('deserializeUser');
                done(null, user);
            } else {
                throw Error('There is no session in session server!');
            }
        }
        catch (e) {
            done(null, false);
        }
    });

    local()
}
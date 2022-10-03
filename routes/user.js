const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require("dotenv").config({path: path.join(__dirname, '/.env')});



router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
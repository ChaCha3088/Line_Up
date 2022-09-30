const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../models/user');


router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', );


module.exports = router;
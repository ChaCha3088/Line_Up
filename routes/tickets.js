const { Router } = require('express');
const router = Router();
const path = require('path');

const userModel = require('../models/user');
const Sessions = require('../models/schemas/session');
const passport = require('passport');
const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
const session = require('express-session');
const express = require("express");
const app = express();



app.use(passport.session());



router.get("/", userModel.logInCheckMiddleware, (req, res, next) => {
    console.log('Ha! Ha! Ha! It Works!');
    res.json('This is Tickets Page!');
});



module.exports = router;
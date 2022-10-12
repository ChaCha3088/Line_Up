const { Router } = require('express');

const router = Router();
const path = require('path');

const infoModel = require('../models/info');
const AAA = require('../models/schemas/InfoStores/AAA');
const nal = require('../models/schemas/InfoStores/nal');
const passport = require('passport');
const mongoose = require('mongoose');
const connectionAuth = mongoose.createConnection('mongodb://localhost:27017/auth');
const userModel = require('../models/user');
const session = require('express-session');
const express = require("express");
const app = express();



app.use(passport.session());



router.get("/", userModel.logInCheckMiddleware, async (req, res, next) => {
    let listResults = await infoModel.getLists(); 
    res.json(`This is Lists and lists is ${listResults}`);
});



module.exports = router;
const { Router } = require('express');

const router = Router();
const path = require('path');

const infoModel = require('../models/info');
const AAA = require('../models/schemas/InfoStores/AAA');
const nal = require('../models/schemas/InfoStores/nal');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const express = require("express");
const app = express();



app.use(passport.session());



router.get("/", infoModel.getLists, (req, res, next) => {
    res.json(`This is Lists`);
});



module.exports = router;
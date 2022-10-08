const { Router } = require('express');
const router = Router();
const path = require('path');
const WaitingLists = require('../models/waitingLists');
const passport = require('passport');
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const userModel = require('../models/user');
const storeModel = require('../models/store');



app.use(passport.session());



router.get("/:storeID", userModel.accessAuth, (req, res, next) => {
    storeModel.getMenus();
    res.json(`This is stores Page!`)
});



module.exports = router;
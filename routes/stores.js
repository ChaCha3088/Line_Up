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



router.get("/:storeID", userModel.logInCheckMiddleware, async (req, res, next) => {
    let storeID = String(req.params.storeID);
    let result = await storeModel.getMenus(storeID);
    res.json(result);
});



module.exports = router;
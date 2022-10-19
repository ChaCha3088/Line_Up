const path = require('path');
require("dotenv").config({path: path.join(__dirname, '/.env')});
const express = require("express");
const listRouter = require('./routes/lists');
const ticketsRouter = require('./routes/tickets');
const storesRouter = require('./routes/stores');
const passport = require('passport');
const passportConfig = require("./passport");
const authRouter = require('./routes/auth');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const app = express();
const userModel = require('./models/user');
const infoModel = require('./models/info');
const freeBoard = require('./models/schemas/Board/freeBoard/freeBoard');
const freeBoardComment = require('./models/schemas/Board/freeBoard/freeBoardComment');
const freeBoardReComment = require('./models/schemas/Board/freeBoard/freeBoardReComment');
const uuid = require('uuid');


app.set('views', path.join(__dirname, 'views')); // 폴더 경로 지정
app.set('view engine' , 'pug'); // 확장자 지정

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({ 
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, httpOnly: true },
    genid: function(req) {
        return uuid.v4();
    },
    store: MongoStore.create({
        mongoUrl: process.env.authServer,
        autoRemove: 'native',
        ttl: 86400,
        stringify: false
    }),
    rolling: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passportConfig();

app.use('/auth', authRouter);
app.use("/stores", storesRouter);
app.use("/tickets", ticketsRouter);
app.use("/lists", listRouter);

app.get('/', async (req, res) => {
    let loginResult = await userModel.isLogIned(req, res);
    if (loginResult.result === 1) {
        let storeListsResult = await infoModel.getStoreLists();
        const context = {
            pageTitle: '메인',
            loginResult: loginResult,
            storeListsResult: storeListsResult
        };
        res.render('main', context);
    } else {
        const context = {
            pageTitle: '메인',
            loginResult: loginResult
        };
        res.render('main', context);
    }
});

app.use((req, res, next) => {
    res.status(404);
    res.send({
        result: 'fail',
        error: `Page not found ${req.path}`
    });
});

app.use((err, req, res, next) => {
    res.status(500);

    res.json({
        result: 'fail',
        error: err.message,
    });
});

const PORT = process.env.port;

app.listen(PORT, () => {
    console.log('This is Express.js!');
});
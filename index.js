require("dotenv").config({path: path.join(__dirname, '/.env')});
const express = require("express");
const listRouter = require('./routes/lists');
const ticketsRouter = require('./routes/tickets');
const waitingsRouter = require('./routes/waitings');
const passportConfig = require('./passport/index');
const userRouter = require('./routes/user');
const path = require('path');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth')
const app = express();

console.log('Hi, Cha Cha!');

passportConfig(app);
app.use(express.json());

app.use(session({ 
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, httpOnly: true, secure: true },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/auth',
    }),
  }));

app.use('/auth', userRouter);
app.use("/waitings", waitingsRouter);
app.use("/tickets", ticketsRouter);
app.use("/lists", listRouter);

app.get('/', (req, res) => {
    res.json('Hello!');
})

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

const PORT = 3000;

app.listen(PORT);
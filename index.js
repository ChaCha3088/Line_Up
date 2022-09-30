const express = require("express");
const listRouter = require('./routes/lists');
const ticketsRouter = require('./routes/tickets');
const waitingsRouter = require('./routes/waitings');
const WaitingLists = require('./models/waitingLists');
const passportConfig = require('./passport/index');
const userRouter = require('./routes/user');

require("dotenv").config();

console.log(process.env.restAPI);

//대기자 리스트 초기화
WaitingLists.initialize();

const app = express();

passportConfig(app);
app.use(express.json());

app.use('/auth', userRouter);
app.use("/waitings", waitingsRouter);
app.use("/tickets", ticketsRouter);
app.use("/lists", listRouter);

app.get('/', (req, res) => {
    //사용자 ID 발급
    const mkID = Math.floor(Math.random() * 100000);
    
    //redirect
    res.redirect(`/lists/${mkID}`)
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

const PORT = process.env.PORT || 3000;

app.listen(PORT);
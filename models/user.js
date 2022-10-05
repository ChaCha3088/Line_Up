module.exports = {
    loginRequired : function(req, res, next) {
        if (!req.user) {
            console.log('로그인 안되어있으면 로그아웃 후 로그인 페이지로');
            req.logout((err) => {
                req.session.destroy();
                if (err) {
                    res.redirect("/auth/kakao");
                } else {
                    res.clearCookie('connect.sid');
                    res.redirect('/auth/kakao');
                }
            });
            return;
        }
        next();
    },

    alreadyLogined: function(req, res, next) {
        if (req.user) {
            console.log('이미 로그인 되어있으니 루트로')
            res.redirect('/');
            return;
        }
        next();
    }, 

    accessAuth: async function(req, res, next) {
        const result = await Sessions.findOne({'passport.user.ID': `${req.user.ID}`}).exec();
        console.log(`result is ${result}`);
        const objData = JSON.parse(result.session);
        console.log(`ojbData is ${objData.passport.user.ID}`);
        if (req.user.ID == objData) {
            
        }
    }
}
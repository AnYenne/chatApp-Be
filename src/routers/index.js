const authRouter = require("./auth.router");
const userRouter = require('./user.route');


function router(app){

    app.use('/users', userRouter );
    app.use('/h', authRouter );
}

module.exports = router;
const authRouter = require("./auth.router");
const userRouter = require('./user.route');

function router(app){

    app.use('/api/users', userRouter );
    app.use('/api/auth', authRouter );
    app.get('/', (req, res)=> res.send('hello'));
}

module.exports = router;
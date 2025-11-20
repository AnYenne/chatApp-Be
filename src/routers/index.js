const authRouter = require("./auth.router");
const userRouter = require('./user.route');
const friendRouter = require('../routers/friend.router');
const conversationRouter = require('../routers/conversation.router')
const messageRouter = require('../routers/message.router')
const authMiddleware = require('../middleware/auth.middleware')


function router(app){
    
    app.use('/api/friends',friendRouter)
    app.use('/api/users', userRouter );
    app.use('/api/conversations', conversationRouter);
    app.use('/api/messages', messageRouter);
    app.use('/api/auth', authRouter );
    app.get('/', (req, res)=> res.send('hello'));
}

module.exports = router;
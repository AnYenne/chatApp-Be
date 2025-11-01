const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {createServer} = require('http');
const {Server} = require('socket.io');

const connectDB = require('./lib/db');
const router = require('./routers/index');

//setup app and server socket.io
const app = express();
const server = createServer(app);
const io =  new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

//config cors, morgan, bodyparse, dotenv
dotenv.config();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser())

//connect DB
 connectDB();

// create Port
const PORT = process.env.PORT || 3000;

//io connection
io.on("connection", socket => {
    console.log('socket.io is connected successfully')
})


//router
router(app);

//start server
server.listen(PORT,()=> console.log(`server running on http://localhost:${PORT}`))
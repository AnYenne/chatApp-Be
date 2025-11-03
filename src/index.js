const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {app,io, server } = require('../src/lib/socket')
// const { join } = require('node:path');

const connectDB = require('./lib/db');
const router = require('./routers/index');

//setup app -> now on socket.js and export app


//config cors, morgan, bodyparse, dotenv
dotenv.config();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser())

//connect DB
connectDB();

// // create Port
const PORT = process.env.PORT || 3000;


// // if code run index.html of server run this
// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname,'index.html'))
// });


// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
  console.log('userconnected', socket.id)
  socket.on('onchat', data => {
    console.log(data)
    io.emit('onchat', data)
  })


})

//router
router(app);

//start server
server.listen(PORT,()=> console.log(`server running on http://localhost:${PORT}`))
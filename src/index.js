const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require('./lib/db');
const router = require('./routers/index');


const app = express();

//config cors, morgan, bodyparse, dotenv
dotenv.config();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

//connect DB
 connectDB();

// create Port
const PORT = process.env.PORT || 3000;

//router
router(app);

//start server
app.listen(PORT,()=> console.log(`server running on http://localhost:${PORT}`))
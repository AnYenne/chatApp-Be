const mongoose = require('mongoose');


const connectDB =  () => {
    const uri = process.env.MONGODB_URI;

     mongoose.connect(uri)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log(`mongodb failed connection`, err) )
  }






module.exports = connectDB;


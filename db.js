const mongoose = require('mongoose');
require('dotenv').config();

//define the mongodb url connection
const mongoURL= process.env.MONGODB_URL_LOCAL //Replace 'mydatabase' with your database name
//const mongoURL= process.env.MONGODB_URL;

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const db=mongoose.connection;

//define event listeners
db.on('connected',()=>{
    console.log('Connected to Mongodb server');
});

db.on('error',(err)=>{
    console.log('Connection error',err);
});

db.on('disconnected',()=>{
    console.log('Disconnected to Mongodb server');
});

//export the database connection

module.exports=db;
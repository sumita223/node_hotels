const mongoose = require('mongoose');

//define the mongodb url connection
const mongoURL=  'mongodb://localhost:27017/hotels'



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
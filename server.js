const express = require('express')
//By storing the Express application instance in the app constant (or variable), you have a reference to that instance. This allows you to use the app variable throughout to interact with and configure your Express application
const app=express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.get("/",(req, res)=>{
    res.send("<h1>Welcome to our hotel</h1>");
})



//import the router files
const personRoutes= require('./routes/personRoutes');
const menuItemRoutes= require('./routes/menuItemRoutes');

//use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);

app.listen(3000,()=>{
    console.log(`The server is running`);
})

const express = require('express');
//By storing the Express application instance in the app constant (or variable), you have a reference to that instance. This allows you to use the app variable throughout to interact with and configure your Express application
const app=express();
const db = require('./db');
require('dotenv').config();
const passport =require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT ||3000;

//Middleware function

const logRequest =(req,res,next) => {
    console.log(`${new Date().toLocaleString()} Request Made to : ${req.originalUrl}`);
    next(); //to move to the next phase 
}
app.use(logRequest);
app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', {session : false});

app.get("/", function(req, res){
    res.send("<h1>Welcome to our hotel</h1>");
})



//import the router files
const personRoutes= require('./routes/personRoutes');
const menuItemRoutes= require('./routes/menuItemRoutes');

//use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);

app.listen(PORT,()=>{
    console.log(`The server is running`);
})

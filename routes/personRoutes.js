const express = require('express');
const router = express.Router(); //helps to manage endpoints

const Person = require('../models/person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
//POST route to add a person
router.post('/signup',async (req,res)=>{
    try{
        const data=req.body //assuming the request body contains the person data

        //create a new Person document using the mongoose model
        const newPerson= new Person(data);

        //save the new person to the database
        const response = await newPerson.save()
        console.log('data saved');

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is :', token);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal service error'});
    }
})

//Route login
router.post('/login', async(req, res)=>{
    try{
        //Extract username and password from user body
        const{username, password} = req.body;

        //Find user by username
        const user= await Person.findOne({username:username});

        //If user does not exist or password does not match return erroe
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'invalid username or password'});
        }

        //If everything is correct then generate token
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);

        //return token as response
        res.json({token})

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal service error'});
    }
})

//Profile Route
router.get('/profile', jwtAuthMiddleware, async(req,res)=>{
    try{
        const userData = req.user;
        console.log("User Data: ",userData);
        const userId= userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal service error'});
    }
})

//GET method to get the person
router.get('/', async(req,res)=>{
    try{
        const data= await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//parameterized api calls

router.get('/:workType', async(req,res)=>{
    
    try{
        const workType= req.params.workType; //Extract the work type from the Url parameter
        if(workType == 'chef' || workType=='manager' || workType == 'waiter'){
            const response= await Person.find({work: workType});
            console.log('response fetched');
            res.status(200).json(response); 
        }else{
            res.status(404).json({error: 'Invalid work type'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//to UPDATE we use PUT/PATCH
//here to take unique id in the para

router.put('/:id', async(req, res)=>{
    try{
        const personId = req.params.id; //Extract the id from the URL parameter
        const updatedPersonData = req.body; //Updated data for the person

        const response = await Person.findByIdAndUpdate(personId,updatedPersonData, {
            new: true, //return the updated document
            runValidators: true, //return mongoose validation
        })

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
        

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//IN DELETE the client will pass the object id in the parameter 

router.delete('/:id', async(req,res)=>{
    try{
        const personId = req.params.id; //Extract the id from the URL parameter
        
        //Assuming you have a Person model
        const response = await Person.findByIdAndDelete(personId); 
        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }

        console.log('data deleted');
        res.status(200).json({message : 'person Deleted Successfully'});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;
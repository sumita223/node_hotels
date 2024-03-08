const express = require('express');
const router = express.Router(); //helps to manage endpoints

const Person = require('./../models/Person');

//POST route to add a person
router.post('/',async (req,res)=>{
    try{
        const data=req.body //assuming the request body contains the person data

        //create a new Person document using the mongoose model
        const newPerson= new Person(data);

        //save the new person to the database
        const response = await newPerson.save()
        console.log('data saved');
        res.status(200).json(response);
    }
    catch(err){
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
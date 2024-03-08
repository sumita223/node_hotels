const express = require('express');
const router = express.Router(); //helps to manage endpoints

const MenuItem = require('./../models/MenuItem');

//POST route to menu
router.post('/',async (req,res)=>{
    try{
        const data=req.body //assuming the request body contains the Menu data

        //create a new Menu document using the mongoose model
        const newMenu= new MenuItem(data);

        //save the new Menu to the database
        const response = await newMenu.save()
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
        const data= await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//parameterized api calls

router.get('/:tasteType', async(req,res)=>{
    
    try{
        const tasteType= req.params.tasteType; //Extract the work type from the Url parameter
        if(tasteType == 'spicy' || tasteType=='sour' || tasteType == 'sweet'){
            const response= await MenuItem.find({taste: tasteType});
            console.log('response fetched');
            res.status(200).json(response); 
        }else{
            res.status(404).json({error: 'Invalid taste'});
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
        const menuId = req.params.id; //Extract the id from the URL parameter
        const updatedMenuData = req.body; //Updated data for the person

        const response = await MenuItem.findByIdAndUpdate(menuId,updatedMenuData, {
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
        const menuId = req.params.id; //Extract the id from the URL parameter
        
        //Assuming you have a Person model
        const response = await MenuItem.findByIdAndDelete(menuId); 
        if(!response){
            return res.status(404).json({error: 'Menu not found'});
        }

        console.log('data deleted');
        res.status(200).json({message : 'menu Deleted Successfully'});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;
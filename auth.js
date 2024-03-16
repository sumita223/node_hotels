const passport =require('passport');
const localStrategy = require('passport-local').Strategy;
const Person = require('./models/person');


passport.use(new localStrategy(async(username, password, done)=>{ 
    //First check request headers has authorization or not
    const authorization= req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Token not found'});
    //authentication logic here

    try{
        //console.log('Received credentials:',USERNAME, password);
        const user = await Person.findOne({username});
        if(!user)
            return done(null,false, {message : 'Incorrect username'});

        const passwordMatch = await user.comparePassword(password);

        if(passwordMatch){
            return done(null,user);

        }
        else{
            return done(null,false,{message : 'Incorrect password'});
        }
    }catch(err){

        return done(err);
    }
}));



module.exports=passport; 



module.exports=passport; 
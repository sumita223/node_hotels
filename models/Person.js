const mongoose= require('mongoose');
const bcrypt = require('bcrypt');

//define the person scheme
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type: Number,
    },
    work:{
        type: String,
        enum: ['chef','owner','manager'],
        required:true
    },
    mobile:{
        type: Number,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type: Number,
        required: true
    },
    username:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }
});

personSchema.pre('save', async function(next){
    const person = this;
    if(!person.isModified('password')) return next(); //this is a saved user and wants to update something else not password
    try{
        //greter the no complex salt will be generated
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //override the password with the hashed one
        person.password = hashedPassword;
        next();

    }catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){

    try{
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}
//Create schema(Person) model
const Person = mongoose.model('Person', personSchema);
module.exports= Person;
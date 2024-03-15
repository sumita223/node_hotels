const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) =>{

    //Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1]; //splitting bearer token
    if(!token) return res.status(401).json({error : 'Unauthorized'});
    //we got token
    try{
        //verify the jwt token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);  

        //Attach user info to the request object
        req.user = decoded;
        next();

    }catch(err){

        console.error(err);
        res.status(401).json({error : 'Invalid error'});
    }
}

//Function to generate jwt token
const generateToken = (userData) =>{

    //Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
}
module.exports = {jwtAuthMiddleware, generateToken}
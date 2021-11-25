/*

API Login/Register Authentication
Uses Mongoose Schemas
Uses Bcrypt to hash passwords


*/

const router = require('express').Router();

//Mongoos Schemas
const User = require('../model/user');
const {registerValidation, loginValidation} = require('../validation');

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const gen = require('./token');
const mongoUtil = require('../mongoUtil');
const { collection } = require('../model/user');

dotenv.config();

// API Access Registration
router.post('/register', async(req, res) => {
    collect = mongoUtil.getApiAccess();
    // validate first
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // check email already exists
    const emailExist = await collect.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already Exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user variable
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const savedUser = await collect.insertOne(user)
        //const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

// login
router.post('/login', async (req, res) => {
    collect = mongoUtil.getApiAccess();
    // validate first
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // check email exists
    const user = await collect.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is wrong');

    // check password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is wrong');

    // Create and assign token
    gen.genToken().then((result) => {
        //res.send(result);
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })

});


module.exports = router;
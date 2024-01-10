//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose = require('mongoose');
const encrypt=  require('mongoose-encryption');


const app= express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB'); 

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});

  

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});

const User=  new mongoose.model('User', userSchema); 

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', async function(req, res){
    const newUser= await new User({email: req.body.username , password: req.body.password});
    const err= await newUser.save();
    if(err!=null){
   
        res.render('secrets');
    } else  {
        console.log("Error");
        res.redirect("/");
    }
   
    
});

app.post('/login', async function(req, res){
    const userName= req.body.username;
    const userPassword= req.body.password; 

    const findUser= await  User.findOne({
        email: userName
    });

    if(findUser.email=== userName){
        if(findUser.password==userPassword){
            res.render('secrets');
        } else {
            console.log('Password not matched. Pl enter correct password');
            res.render('login');
        }
        
    } else{
        console.log("Error");
        res.redirect('/');
    }
    });




app.listen(3000, function () {
    console.log('Server started on port 3000.');    
})
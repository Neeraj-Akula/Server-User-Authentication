const dotenv=require("dotenv")
const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const app = express();


dotenv.config({path:'./config.env'})
const DB=process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log("databasde connected")
}).catch(()=>{
    console.log("err at databse")
})

app.use(express.json());

app.use(cors({origin:"*"}))

app.post('/Register',async (req, res) =>{
    try{
        const{username,email,password,confirmpassword} = req.body;
        let exist = await Registeruser.findOne({email})
        if(exist)
        {
            return res.status(400).send('User Already Exist')
        }
        if(password !== confirmpassword)
        {
            return res.status(400).send('Passwords are not matching');
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')

    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internel Error')
    }
})

      app.post('/Login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>
          {
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/MyProfile',middleware,async(req, res)=>{
    try{
        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User not found');
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})



 if( process.env.NODE_ENV == "production")
 {

  app.use(express.static("client/build"));
      const path = require("path");

          app.get("*", (req, res) => {

  res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'));

 })
 }
 app.listen(process.env.PORT||3001,()=>{
    console.log("serverr connected")
})


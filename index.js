const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
// var encrypt = require('mongoose-encryption');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/project_k');


const signupSchema = new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  phone_number:Number,
  gender:String,
  dob: String,
  password:String

})

const signup =mongoose.model("signups",signupSchema)

app.get("/",(req,res)=>{
    res.render("signup")
})

app.post("/signup",(req,res)=>{

    console.log("sigup:"+req.body.name)
    console.log("sigup:"+req.body.email)
    console.log("sigup:"+req.body.phone)
    console.log("sigup:"+req.body.gender)
    console.log("sigup:"+req.body.dob)
    console.log("sigup:"+req.body.password)
    
    const newperson = new signup ({
        name:req.body.name,
        email:req.body.email,
        phone_number:req.body.phone,
        gender:req.body.gender,
        dob:req.body.dob,
        password:req.body.password
    })
    newperson.save()
    
    res.redirect("/")
})

app.listen(3000, function (req, res) {
    console.log("server is up");
  });
  
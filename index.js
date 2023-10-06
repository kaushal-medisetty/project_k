const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");

const dbs = require("./src/mongo_connect")
const medapi = require("./src/api")
// var encrypt = require('mongoose-encryption');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/signin",(req,res)=>{
    res.render("signin")
})

app.get("/api",async(req,res)=>{
  let name = "Dolo-650"
  let valapi = await medapi.meddetails(name)
  console.log(valapi)
  res.json(valapi)
})



app.post("/signin",async (req,res)=>{
    
    console.log("sigin:"+req.body.email,req.body.password)
    let data1={
      user:req.body.email,
      password:req.body.password
    }
    let val
    val = await dbs.signin(data1);
    res.send(val)

})

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
    let data ={
      name:req.body.name,
      email:req.body.email,
      phone_number:req.body.phone,
      gender:req.body.gender,
      dob:req.body.dob,
      password:req.body.password
    }
    dbs.signup(data)
    
    res.redirect("/")
})

app.listen(3000, function (req, res) {
    console.log("server is up");
  });
  

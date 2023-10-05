const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/collection');


const signupSchema = new mongoose.Schema({
  name:String,
  password:String,
  id:String
})

const blogsSchema = new mongoose.Schema({
  name:String,
  descripition:String,
  content:String,
  id:String

})

const infoSchema = new mongoose.Schema({
  fname: String,
  id:String,
  instagram: String,
  uname: String,
  city: String,
  rel: String,
  gender: String,
  phone: String,
  email: String,
  address: String,
  status: String,
  facebook: String,
  descretion: String,
  file:String,
  files:[String]
})


const signup =mongoose.model("signups",signupSchema)
const Info =mongoose.model("info",infoSchema)
const Blog =mongoose.model("blog",blogsSchema)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    var filename = file.originalname;
    

    return cb(null, filename);
  },
});

const upload = multer({ storage });




// var secret = "siva"
// signupSchema.plugin(encrypt, { secret: secret,encryptedFields: ["password"] });


app.get("/",(req,res)=>{
  res.render("signup")
})


app.get("/posts/:topic", (req, res) => {
  Info.find({_id:req.params.topic}).then(function(data){

        res.render("conten",{post:data[0]})
    }).catch(function(err){
        console.log(err)
    })
 
})

var op="";
app.get("/dashboard",(req,res)=>{ 
  async function fun1(op) {
      const s = await Info.find({});
      
      res.render("dashboard",{posts:s,id:op})
  
      }
      fun1(op)
  })
  
  app.post("/",(req,res)=>{

    user=req.body.username
    password=req.body.password
    data=signup.findOne({name:user}).then((data)=>{
      op=data.name
      if(data.name == user){
          if(data.password == password ){
            res.redirect("dashboard")
          }
      }
     }
    
  )})
  

app.post("/add",(req,res)=>{
  res.render("add_people")
})


app.post('/uploadpic', upload.array('finpic', 12), function (req, res) {
  
  
  var g = []
 
  var k=req.files
 k.forEach(l => {
  g.push(l.originalname)
 });

Info.updateOne({_id:req.body.upload},{ "$push":{files:g}},{upsert: true}).then(function () {
      console.log("done");
    })
    .catch(function (err) {
      console.log(err);
    });
    res.redirect("/page/"+req.body.upload)


})

app.get("/page/:post", (req, res) => {

  Blog.find({_id:req.params.post}).then(function(data){
    
    res.render("post", {
      title: data[0].name,
      content: data[0].content,
      id:data._id

    });
    }).catch(function(err){
        console.log(err)
    })
 
})


app.post("/compose1",(req,res)=>{
    const post = {
    title: req.body.postTitle,
    descripition:req.body.descripition,
    content: req.body.postBody,
    id:req.body.id
  };
  const blogs1 = new  Blog({
    name:post.title,
    descripition:post.descripition,
    content:post.content,
    id:post.id

  }) 




  Blog.find({id:post.id}).then((data)=>{
     
    res.render("home", {
      id:req.body.edit,
      posts: data,
     
      });
  })
  
})




app.post("/compose",(req,res)=>{
  
  res.render("compose",{id:req.body.button})
})


app.post("/edit",(req,res)=>{
    
     Blog.find({id:req.body.edit}).then((data)=>{
     
      res.render("home", {
        id:req.body.edit,
        posts: data,
       
        });
    })
})


app.post("/up",upload.single('avatar'),function (req, res) {
  const newperson = new Info ({
    fname: req.body.first_name,
    instagram: req.body.Instagram,
    uname: req.body.uname,
    city: req.body.city,
    rel: req.body.relationship,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.Address,
    status: req.body.status,
    facebook: req.body.Facebook,
    descretion: req.body.descretion,
    file:req.file.filename
  
  });
  
  newperson.save();
  res.redirect("/dashboard");
  }
);


app.listen(4000, function (req, res) {
    console.log("server is up");
  });
  
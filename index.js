const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const dbs = require("./src/mongo_connect")
const medapi = require("./src/api")
const st = require("./src/stroage")
const ntfy_ = require("./src/ntfy")
const mid = require("./src/middleware")
// var encrypt = require('mongoose-encryption');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// const axios = require("axios");


app.get("/",(req,res)=>{
  res.render("signup")
})

app.get("/api",async(req,res)=>{
  let name = "Dolo-650"
  let valapi = await medapi.meddetails(name)
  console.log(valapi)
  

  await ntfy_.ntfy("ok1","siva")
  res.json(valapi)
  

})

app.get("/signin",(req,res)=>{
  res.render("signin")
})

app.get("/dashboard",(req,res)=>{
  var gg= req.cookies["context"];
  res.clearCookie("context", { httpOnly: true });
  res.render("dashboard",{data:gg})

})
app.get("/tryagain",(req,res)=>{
  res.send("wrong password")

})

app.get("/reports",(req,res)=>{
  res.render("reports")

})

app.get("/upload",(req,res)=>{
  res.render("upload")

})

// app.get("/setcookie",(req,res)=>{
//   try{
//     res.cookie("sessionId","844a2b0ce474227509eb629bc56c1359")
//     res.send("Siva ")
//   }catch(e){
//     console.log(e)
//   }
// })


app.post("/signin",async (req,res)=>{


            let data1={
              user:req.body.email,
              password:req.body.password
            }
            let val
            val = await dbs.signin(data1);

            res.cookie("context", val.data, { httpOnly: true });
            res.redirect(val.redirect)
      
  
})




app.post("/signup",(req,res)=>{

    let data ={
      name:req.body.name,
      email:req.body.email,
      phone_number:req.body.phone,
      gender:req.body.gender,
      dob:req.body.dob,
      password:req.body.password
    }
    dbs.signup(data)
    //hash
    //cookie
    res.redirect("/")
})


var name

let storage=multer.diskStorage({
            destination: function (req, file, cb) {
              var directoryPath='./public/data/'+name
                if (fs.existsSync(directoryPath)) {
                  cb(null, './public/data/'+name)
                } else {
                  try {
                    fs.mkdirSync(directoryPath);
                    console.log('Directory created successfully');
                    cb(null, directoryPath)
                  } catch (error) {
                    console.error('Error creating directory:', error);
                  }
                } 
           
          },
          filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.originalname+'-'+uniqueSuffix)
          }
          })
const upload1 = multer({ storage: storage })
// let upload1  =multer({ dest: './public/data/uploads/' })
app.post('/reports_post', upload1.single('uploaded_file'), (req, res) => {

    console.log(req.body.doc_name)
    console.log(req.body.description)
    console.log(req.file)
    name="uploads1/kk"
    
    // 
});





app.listen(3000, function (req, res) {
    console.log("server is up");
  });
  

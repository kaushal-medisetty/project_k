const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const jwt = require("./src/jwt.js")
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
app.get("/null",(req,res)=>{
  res.send("Null")
})


app.get("/dashboard", async (req, res) => {
  let auth1 = req.cookies["auth"];
  console.log("dash:"+auth1)
  let jwt1 = await dbs.checkauth(auth1);
  console.log("ss:"+jwt1) 
  if (jwt1) {
    gg={
      name:"all"
    }
    res.render("dashboard", { data: gg });
  }
  else{
    gg={
      name:"not all"
    }
    res.render("dashboard", { data: gg });
  }
});

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
              email:req.body.email,
              password:req.body.password
            }
            let val
            val = await dbs.signin(data1);
       
            auth=jwt.getNewtoks(val.email,data1.password)
            
            res.cookie("auth", auth, { httpOnly: true });
            console.log("signin:",val.redirect)
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
    // let data1 ={
    //   name:req.body.name,
    //   email:req.body.email,
    //   phone_number:req.body.phone,
    //   gender:req.body.gender,
    //   dob:req.body.dob,
      
    // }
    dbs.signup(data)
    auth=jwt.getNewtoks(data.name,data.password)
    // auth={
    //   email:req.body.email,
    //    jwt:auth,
    // }
    // dbs.auth(auth)
    res.cookie("auth", auth, { httpOnly: true });
    // res.cookie("context", data1, { httpOnly: true });
    res.redirect("/dashboard")
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
  

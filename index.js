const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { localsName, render } = require("ejs");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const jwt = require("./src/jwt.js");
const dbs = require("./src/mongo_connect");
const medapi = require("./src/api");
const st = require("./src/stroage");
const ntfy_ = require("./src/ntfy");
const mid = require("./src/middleware");
// var encrypt = require('mongoose-encryption');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// const axios = require("axios");

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/api", async (req, res) => {
  let name = "Dolo-650";
  let valapi = await medapi.meddetails(name);
  console.log(valapi);

  await ntfy_.ntfy("ok1", "siva");
  res.json(valapi);
});

app.get("/signin", (req, res) => {
  res.render("signin");
});
app.get("/null", (req, res) => {
  res.send("Null");
});

app.get("/dashboard", async (req, res) => {
  let auth1 = req.cookies["auth"];
  // console.log("dash:" + auth1);
  let jwt_data = await dbs.checkauth(auth1);
  // console.log(">>> checkToks >>>:" + jwt_data);
  if (jwt_data) {
    userData_dash = {
      name: jwt_data.name,
      email: jwt_data.email,
    };
    res.render("dashboard", { data: userData_dash });
  } else {
    userData_dash = {
      name: "not all",
    };
    res.render("dashboard", { data: userData_dash });
  }
});

app.get("/tryagain", (req, res) => {
  res.send("wrong password");
});

app.get("/reports", async (req, res) => {
  let toks = req.cookies["auth"];
  console.log(toks);
  let userdata = jwt.dectoks(toks);
  if (userdata.name == null || userdata == undefined) {
    res.redirect("/signin");
  } else {
    let rep = await dbs.getreport(userdata.email);
    for (let i = 0; i < rep.length; i++) {
      console.log(">>>[reports] <<< " + rep[i].report_name);
      console.log(">>>[reports] <<< " + rep[i].desc);
    }
  }
  res.render("reports");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/signin", async (req, res) => {
  // console.log(">>>" + req.body.email + "__" + req.body.password);
  let data1 = {
    email: req.body.email,
    password: req.body.password,
  };

  let val = await dbs.signin(data1);

  auth = jwt.getNewtoks(val.u_email, val.u_name);

  res.cookie("auth", auth, { httpOnly: true });
  console.log("signin:", val.redirect);
  res.redirect(val.redirect);
});

app.post("/signup", (req, res) => {
  let data = {
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone,
    gender: req.body.gender,
    dob: req.body.dob,
    password: req.body.password,
  };

  // }
  dbs.signup(data);
  auth = jwt.getNewtoks(data.email, data.name);
  res.cookie("auth", auth, { httpOnly: true });
  res.redirect("/dashboard");
});

var name;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var directoryPath = "./public/data/" + name;
    if (fs.existsSync(directoryPath)) {
      cb(null, "./public/data/" + name);
    } else {
      try {
        fs.mkdirSync(directoryPath);
        console.log("Directory created successfully");
        cb(null, directoryPath);
      } catch (error) {
        console.error("Error creating directory:", error);
      }
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});
const upload1 = multer({ storage: storage });
// let upload1  =multer({ dest: './public/data/uploads/' })
app.post("/reports_post", upload1.single("uploaded_file"), (req, res) => {
  console.log(req.body.doc_name);
  console.log(req.body.description);
  console.log(req.file);
  name = "uploads1/kk";

  //
});

app.listen(3000, function (req, res) {
  console.log("server is up");
});

console.log("Fucked ups ");

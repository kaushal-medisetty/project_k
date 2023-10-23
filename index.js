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
const ntfy = require("./src/ntfy");
const mid = require("./src/middleware");
const shed = require("./src/scheduler");
const { log } = require("console");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let toks = req.cookies["auth"];
    if (!toks) {
      res.redirect("./signin");
    } else {
      let userdata = jwt.dectoks(toks);
      var directoryPath = "./public/data/" + userdata.email;
      if (fs.existsSync(directoryPath)) {
        cb(null, "./public/data/" + userdata.email);
      } else {
        try {
          fs.mkdirSync(directoryPath);
          console.log("Directory created successfully");
          cb(null, directoryPath);
        } catch (error) {
          console.error("Error creating directory:", error);
        }
      }
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});
const upload1 = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("signup");
});

// app.get("/api", async (req, res) => {
//   let name = "Dolo-650";
//   let valapi = await medapi.meddetails(name);

//   await ntfy.ntfy("ok1", "siva");
//   res.json(valapi);
// });

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  let data1 = {
    email: req.body.email,
    password: req.body.password,
  };
  let val = await dbs.signin(data1);
  auth = jwt.getNewtoks(val.u_email, val.u_name);
  res.cookie("auth", auth, { httpOnly: true });
  res.redirect(val.redirect);
});

app.get("/signup", (req, res) => {
  res.render("signup");
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

  dbs.signup(data);
  auth = jwt.getNewtoks(data.email, data.name);
  res.cookie("auth", auth, { httpOnly: true });
  res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
  let auth1 = req.cookies["auth"];
  if (!auth1) {
    console.log("Cumming check!!");
    res.redirect("./signin");
  } else {
    let jwt_data = await dbs.checkauth(auth1);
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
  }
});

app.post("/reports_post", upload1.single("uploaded_file"), (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      data = {
        u_email: userdata.email,
        u_name: req.body.doc_name,
        rep_des: req.body.description,
        rep_name: req.file.originalname,
        rep_dest: req.file.destination,
      };

      dbs.up_reports(
        data.u_email,
        data.u_name,
        data.rep_des,
        data.rep_name,
        data.rep_dest
      );
      res.redirect("/reports");
    }
  }
});

app.get("/reports", async (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      let rep = await dbs.getreport(userdata.email);
      res.render("reports", { rep: rep });
    }
  }
});

app.post("/report_del", (req, res) => {
  console.log(req.body.delete);
  dbs.reports_del(req.body.delete);
  res.redirect("/reports");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------

app.get("/medicines", async (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      let rep = await dbs.getalert(userdata.email);
      res.render("medicines", { rep: rep });
    }
  }
});

app.get("/medicines_uploder", (req, res) => {
  res.render("medicines_uploder");
});

app.post("/alertm", async (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      data = {
        email: userdata.email,
        drug: req.body.drug_name1,
        desc: req.body.description1,
        time: req.body.time,
        date: req.body.date,
      };
      let lstva = await dbs.getlastrec();
      console.log(">>lstva : " + lstva);
      if (!lstva) lstva = 0;

      lstva += 1;
      await dbs.up_alert(
        data.email,
        data.drug,
        data.desc,
        data.time,
        data.date,
        lstva
      );
      shed.scheduler(lstva, data.time, userdata.name, data.desc);
    }
    res.redirect("/medicines");
  }
});

app.post("/alert_remove", (req, res) => {
  dbs.alert_del(req.body.remove);
  res.redirect("/medicines");
});

app.post("/app_remove", (req, res) => {
  dbs.app_del(req.body.remove);
  res.redirect("/appoiment");
});

app.get("/appoiment", async (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      let rep = await dbs.getapp(userdata.email);
      res.render("appoiment", { rep: rep });
    }
  }
});

app.post("/alerta", async (req, res) => {
  let toks = req.cookies["auth"];
  if (!toks) {
    res.redirect("./signin");
  } else {
    let userdata = jwt.dectoks(toks);
    if (userdata.name == null || userdata == undefined) {
      res.redirect("/signin");
    } else {
      data = {
        email: userdata.email,
        Doc_name: req.body.doc_name1,
        desc: req.body.description1,
        time: req.body.time,
        date: req.body.date,
      };
      let lstva = await dbs.getlastrec1();
      console.log(">>lstva : " + lstva);
      if (!lstva) lstva = 0;

      lstva += 1;
      await dbs.up_app(
        data.email,
        data.Doc_name,
        data.desc,
        data.time,
        data.date,
        lstva
      );
      shed.apposhed(lstva, data.time, data.Doc_name, userdata.name);
    }
    res.redirect("/appoiment");
  }
});

app.get("/appoiment_up", (req, res) => {
  res.render("appoiment_up");
});

app.post("/appoiment", (req, res) => {
  dbs.app_del(req.body.remove);
  res.redirect("/appoiment");
});

app.get("/trigger", (req, res) => {
  ntfy.ntfy("Working");
  res.redirect("./sigin");
});

app.post("/cancelalrt", async (req, res) => {
  let canval = req.body.calval;
  shed.canshed(canval);
  res.redirect("/medicines");
});

app.listen(3000, function (req, res) {
  console.log("server is up");
});

const mongoose = require("mongoose");
const jwt = require("./jwt.js");
const { name } = require("ejs");
const { ls } = require("shelljs");
mongoose.connect("mongodb://127.0.0.1:27017/project_k");


//sigup
const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone_number: { type: Number },
  gender: String,
  dob: String,
  password: String,
});

const signup = mongoose.model("signups", signupSchema);



exports.signup = async (data) => {
  const newperson = new signup(data);
  await newperson.save();
};


//sigin
exports.signin = async (data1) => {
  try {
    const user = await signup.findOne({ email: data1.email });

    if (!user) {
      return { redirect: "/tryagain" };
    }

    if (user.email === data1.email && user.password === data1.password) {
      const userData = {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        dob: user.dob,
      };
      console.log(
        "DB_connect _ userdata >>>" + userData.name + " ____" + userData.email
      );
      return {
        redirect: "/dashboard",
        u_email: userData.email,
        u_name: userData.name,
      };
    } else {
      return { redirect: "/tryagain" };
    }
  } catch (error) {
    console.error("Error in signin:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};



//auth
exports.checkauth = async (auth1) => {
  let credentials = jwt.dectoks(auth1);
  console.log(
    ">> DecToks <<< :" + credentials.name + "<<<" + credentials.email
  );
  const usersdata = await signup.findOne({
    email: credentials.email,
    name: credentials.name,
  });

  if (usersdata === null) {
    return "no";
  } else {
    return usersdata;
  }
};



//report


const reportschema = new mongoose.Schema({
  name: String,
  email: String,
  desc: String,
  report_name: String,
  dest: String,
  data: Date,
});

const reports = mongoose.model("report", reportschema);


exports.up_reports = async (u_email, u_name, rep_des, rep_name, rep_dest) => {
  //(username , user_email, report name , report Desc)
  const N_report = {
    email: u_email,
    name: u_name,
    desc: rep_des,
    report_name: rep_name,
    //data: Date1,
    dest: rep_dest,
    data: Date.now(),
  };
  let rport = new reports(N_report);
  await rport.save();
  return true;
};



exports.getreport = async (u_email) => {
  const report = await reports.find({ email: u_email });
  return report;
};



exports.reports_del = async (id) => {
  reports
    .deleteOne({ _id: id })
    .then(function () {
      console.log("done");
    })
    .catch(function (err) {
      console.log(err);
    });
};




//alert (medines)

const alertschema = new mongoose.Schema({
  Drug: String,
  email: String,
  desc: String,
  report_time: String,
  data: Date,
  alertNo: Number,
});

const alert = mongoose.model("alert", alertschema);

exports.up_alert = async (
  u_email,
  a_drug,
  a_desc,
  a_time,
  a_date,
  a_alerNo
) => {
  const N_alert = {
    Drug: a_drug,
    email: u_email,
    desc: a_desc,
    report_time: a_time,
    data: a_date,
    alertNo: a_alerNo,
  };
  let ralert = new alert(N_alert);
  await ralert.save();
  return true;
};



exports.getalert = async (user) => {
  const alert1 = await alert.find({ email: user });
  return alert1;
};



exports.getlastrec = async () => {
  const lst = await alert.findOne({}).sort({ _id: -1 }).limit(1);
  console.log(lst);
  let lstval;
  try {
    if (!lst.alertNo || !lst) {
      lstval = 0;
    } else {
      lstval = lst.alertNo;
    }
  } catch (error) {
    lstval = 0;
  }
  return lstval;
};

exports.alert_del = async (id) => {
  alert.deleteOne({ _id: id }).then(function () {
    console.log("done");
  });
};



//appoiment
const appschema = new mongoose.Schema({
  Doc_name: String,
  email: String,
  desc: String,
  report_time: String,
  data: Date,
  alertNo: Number,
});

const app = mongoose.model("appoment", appschema);

exports.up_app = async (
  u_email,
  a_Doc_name,
  a_desc,
  a_time,
  a_date,
  a_alerNo
) => {
  const N_app = {
    Doc_name: a_Doc_name,
    email: u_email,
    desc: a_desc,
    report_time: a_time,
    data: a_date,
    alertNo: a_alerNo,
  };
  let ralert = new app(N_app);
  await ralert.save();
  return true;
};



exports.getapp = async (user) => {
  const app1 = await app.find({ email: user });
  return app1;
};



exports.getlastrec1 = async () => {
  const lst = await alert.findOne({}).sort({ _id: -1 }).limit(1);
  console.log(lst);
  let lstval;
  try {
    if (!lst.alertNo || !lst) {
      lstval = 0;
    } else {
      lstval = lst.alertNo;
    }
  } catch (error) {
    lstval = 0;
  }
  return lstval;
};


exports.app_del = async (id) => {
  app.deleteOne({ _id: id }).then(function () {
    console.log("done");
  });
};










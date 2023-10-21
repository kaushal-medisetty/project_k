const mongoose = require("mongoose");
const jwt = require("./jwt.js");
const { name } = require("ejs");
mongoose.connect("mongodb://127.0.0.1:27017/project_k");

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

const reportschema = new mongoose.Schema({
  name: String,
  email: String,
  desc: String,
  report_name: String,
  data: Date,
});

const reports = mongoose.model("report", reportschema);

exports.getreport = async (u_email) => {
  const report = await reports.find({ email: u_email });
  return report;
};

exports.up_reports = async (u_name, u_email, rep_name, rep_des) => {
  //(username , user_email, report name , report Desc)
  const N_report = {
    email: u_email,
    name: u_name,
    desc: rep_des,
    report_name: rep_name,
    data: Date.now(),
  };
  let rport = new reports(N_report);
  await rport.save();
  return true;
};

exports.signup = async (data) => {
  const newperson = new signup(data);
  await newperson.save();
};

exports.checkauth = async (auth1) => {
  console.log("check1:" + auth1);
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

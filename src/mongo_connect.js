const mongoose = require("mongoose");
const jwt = require("./jwt.js")
mongoose.connect('mongodb://127.0.0.1:27017/project_k');



const signupSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  phone_number:{type:Number},
  gender:String,
  dob: String,
  password:String

})


// const athuSchema = new mongoose.Schema({
//     email:String,
//     jwt:String,
   
  
//   })
  // const auth =mongoose.model("auth",athuSchema)


// exports.auth = async(authdata)=>{
//     const newauth = new auth(authdata)
//     await newauth.save()
// }

const signup =mongoose.model("signups",signupSchema)

exports.signup = async(data)=>{
    const newperson = new signup(data)
    await newperson.save()
}


exports.checkauth = async (auth1) => {
  console.log("check1:"+auth1)
      let credentials= jwt.dectoks(auth1);
      console.log("check2:"+credentials)
      console.log("check3:"+credentials.email+"+"+credentials.pass)
      const data11 = await signup.findOne({ email:credentials.email,name:credentials.pass});
     
      if (data11=== null) {
        return "no";
      } else{
        return "credentials.email";
      }
      
    
  };

exports.signin= async (data1)=>{
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
        dob: user.dob
      };

      return {
        redirect: "/dashboard",
        data: userData
      };
    } else {
      return { redirect: "/tryagain" };
    }
  } catch (error) {
    console.error("Error in signin:", error);
    throw error; // Rethrow the error to be handled by the caller
  }

}
   


    // const newperson = new signup ({
    //     name:req.body.name,
    //     email:req.body.email,
    //     phone_number:req.body.phone,
    //     gender:req.body.gender,
    //     dob:req.body.dob,
    //     password:req.body.password
    // })
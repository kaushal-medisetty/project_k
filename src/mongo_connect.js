const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/project_k');



const signupSchema = new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  phone_number:{type:Number},
  gender:String,
  dob: String,
  password:String

})

const signup =mongoose.model("signups",signupSchema)

exports.signup = async(data)=>{
    const newperson = new signup(data)
    await newperson.save()
}



exports.signin= async (data1)=>{
    let k
    return k=await signup.findOne({email:data1.user}).then((data)=>{  
    if(data.email == data1.user){
        if(data.password == data1.password ){
           
           return "signup"
           
        }
    }else{
        return"wrog"
    }

   })
   
}

    // const newperson = new signup ({
    //     name:req.body.name,
    //     email:req.body.email,
    //     phone_number:req.body.phone,
    //     gender:req.body.gender,
    //     dob:req.body.dob,
    //     password:req.body.password
    // })
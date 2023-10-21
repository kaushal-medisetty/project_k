const jwt = require("jsonwebtoken");


exports.getNewtoks = (email1,pass1) => {
    payload={
        email:email1, 
        pass:pass1,
    }
    try{
     token = jwt.sign(payload, "secret");
    }catch (err) {
        const error = new Error("Error! Something went wrong.");
        return next(error);
      }
      
      return token;
}

exports.dectoks = (token) => {
    const decodedToken = jwt.verify(token, "secret");
    const vals = {
      email: decodedToken.email,
      pass: decodedToken.pass,
    };
    return vals;
  };
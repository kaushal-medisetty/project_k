const jwt = require("jsonwebtoken");

exports.getNewtoks = (u_email, name) => {
  console.log(">>>" + u_email + "___" + name);
  payload = {
    email: u_email,
    name: name,
  };
  try {
    token = jwt.sign(payload, "secret");
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  return token;
};

exports.dectoks = (token) => {
  const decodedToken = jwt.verify(token, "secret");
  const vals = {
    email: decodedToken.email,
    name: decodedToken.name,
  };
  return vals;
};

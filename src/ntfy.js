const shell = require("shelljs");

exports.ntfy = (message, topic = "siva") => {
  let ntfy = `curl -d "${message}" http://ntfy.sivahomelab.online/${topic}`;
  console.log(ntfy);
  shell.exec(ntfy);
};

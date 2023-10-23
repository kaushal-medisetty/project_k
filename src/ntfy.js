const shell = require("shelljs");

exports.ntfy = (message, topic) => {
  let ntfy = `curl -d ${message} http://ntfy.sivahomelab.online/${topic}`;
  shell.exec(ntfy);
};

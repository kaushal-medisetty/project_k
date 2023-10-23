const shell = require("shelljs");

exports.ntfy = async (message, topic) => {
  let ntfy = `curl -d ${message} http://ntfy.sivahomelab.online/${topic}`;
  shell.exec(ntfy);
};

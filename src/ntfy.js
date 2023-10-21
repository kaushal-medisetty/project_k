const shell = require('shelljs');



exports.ntfy=async(message,topic1)=>{
    let ntfy=`curl -d ${message} http://ntfy.sivahomelab.online/${topic1}`
    shell.exec(ntfy)
    }
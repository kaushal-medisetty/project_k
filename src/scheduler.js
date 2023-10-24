const schedule = require("node-schedule");
const ntfy = require("./ntfy");
let job = [];

exports.scheduler = (val, remhr, name, desc) => {
  remhr = remhr.toString();
  remhr = remhr.split(":");
  console.log(`Sheduled for time ${remhr}`);
  const rule = new schedule.RecurrenceRule();
  rule.hour = remhr[0];
  rule.minute = remhr[1];
  rule.second = "00";
  job[val] = schedule.scheduleJob(rule, function () {
    console.log(
      `>>> Scheduled for : + ${remhr[0].toString()}.${remhr[1].toString()} `
    );
    ntfy.ntfy(desc, name);
  });
};

let appm = [];

exports.apposhed = (val, apptim, docName, name) => {
  apptim = apptim.toString();
  appm[val] = new schedule.scheduleJob(apptim, () => {
    console.log(`>>> app set For Doctor ${docName}  For time ${apptim}`);
  });
  ntfy.ntfy(docName, name);
};

exports.canshed = (val) => {
  job[val].cancel();
  console.log(`schedule canceled :: <<< [ ${job[val]} ]`);
};

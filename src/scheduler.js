const schedule = require("node-schedule");
const ntfy = require("./ntfy");
let job = [];

exports.scheduler = (val, remhr) => {
  remhr = remhr.toString();
  remhr = remhr.split(":");
  console.log(`Sheduled for time ${remhr}`);
  const rule = new schedule.RecurrenceRule();
  rule.hour = remhr[0];
  rule.minute = remhr[1];
  job[val] = schedule.scheduleJob(rule, function () {
    console.log(
      `>>> Scheduled for : + ${remhr[0].toString()}.${remhr[1].toString()} `
    );
    ntfy.ntfy(
      "matter siva  :  Siva Sucks!!! vanthu matter katha sollu :D ",
      "siva"
    );
  });
};

exports.canshed = (val) => {
  job[val].cancel();
  console.log(`schedule canceled :: <<< [ ${job[val]} ]`);
};

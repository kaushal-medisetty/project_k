exports.makedataTime = (date, time) => {
  date = date.toString();
  time = time.toString();
  date = date.split("T");
  let temp = date[1].split(":");
  let newdate = date[0] + "T" + time + ":" + temp[2] + ":" + temp[3];
  console.log(newdate);
};

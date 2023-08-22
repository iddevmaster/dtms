const exports = {};
exports.course_group = [
  "เรียนขับรถและสอบใบอนุญาตฯ",
  "เรียนขับรถ แต่ไม่สอบใบอนุญาตฯ",
  "อบรมภาคทฤษฎี",
];
exports.subject_type = ["วิชาบังคับ", "วิชาเพิ่มเติม"];
exports.subject_learn_type = ["ทฤษฏี", "ปฏิบัติ"];
exports.prefix = ["นาย", "นาง", "นางสาว", "Mr.", "Mrs.", "Miss"];
exports.vehicle_type = ["รถยนต์", "รถจักรยานยนต์"];
exports.unit_type = ["รายชั่วโมง", "รายวัน", "รายเดือน", "รายคน"];
exports.amount_type = ["สอน", "คุมสอบ", "กรรมการ", "ประธาน", "เงินเดือน"];
exports.staff_exam_type = ["ประธาน", "กรรมการ"];
exports.pay_status_format = (value) => {
  let typeformat;
  if (value === "RS") {
    typeformat = "ลูกค้าจองตารางเรียน แต่ยังไม่ชำระเงิน";
  } else if (value === "PP") {
    typeformat = "ชำระเงินบางส่วนแต่ยังไม่ครบ";
  } else if (value === "PA") {
    typeformat = "ชำระเงินครบทั้งหมดแล้ว";
  } else {
    typeformat = "-";
  }
  return typeformat;
};
exports.user_type_format = (value) => {
  let typeformat;
  let uset_type = parseInt(value);
  if (uset_type === 1) {
    typeformat = "ผู้ดูแลระบบ";
  } else if (uset_type === 2) {
    typeformat = "ผู้ดูแลระบบโรงเรียน";
  } else if (uset_type === 3) {
    typeformat = "เจ้าหน้าที่โรงเรียน";
  } else if (uset_type === 4) {
    typeformat = "ครู / วิทยากร";
  } else if (uset_type === 5) {
    typeformat = "นักเรียน";
  } else {
    typeformat = "-";
  }
  return typeformat;
};

exports.register_status_format = (value) => {
  let typeformat;
  if (value === "NR") {
    typeformat = "สมัครเรียนเสร็จแล้ว";
  } else if (value === "LC") {
    typeformat = "การเรียนครบชั่วโมงแล้ว";
  } else if (value === "RT") {
    typeformat = "ลงทะเบียนสอบแล้ว";
  } else {
    typeformat = "-";
  }
  return typeformat;
};
exports.setRegisterIndex = (
  rm_id,
  course_group,
  course_id,
  teacher_id,
  dateDefault,
  typefilter,
  stepper,
  allStep,
  month,
  year,
  start_time,
  end_time,
  vehicle_type_id,
  branch_id,
  school_id,
  teacher_event
) => {
  let setMainRegister = {
    rm_id: rm_id,
    course_group: course_group,
    course_id: course_id,
    teacher_id: teacher_id,
    dateDefault: dateDefault,
    typefilter: typefilter,
    stepper: stepper,
    allStep: allStep,
    month: month,
    year: year,
    start_time: start_time,
    end_time: end_time,
    vehicle_type_id: vehicle_type_id,
    branch_id: branch_id,
    school_id: school_id,
    teacher_event: teacher_event,
  };
  localStorage.setItem("setMainRegister", JSON.stringify(setMainRegister));
  return true;
};

exports.getRegisterIndex = () => {
  const d = new Date();
  const setMainRegister = JSON.parse(localStorage.getItem("setMainRegister"));
  let set;
  if (setMainRegister === null) {
    set = {
      rm_id: "",
      course_group: 0,
      course_id: "",
      teacher_id: "",
      dateDefault: "",
      typefilter: 1,
      stepper: 1,
      allStep: 1,
      month: d.getMonth() + 1, /// index js ของ month เริ่มที่ 0
      year: d.getFullYear(),
      start_time: "08:00:00",
      end_time: "17:00:00",
      vehicle_type_id: 0,
      branch_id: "",
      school_id: "",
      teacher_event: [],
    };
  } else {
    set = setMainRegister;
  }

  return set;
};

exports.getAllStepRegister = (course_group) => {
  let r; //
  if (course_group === 1) {
    r = 4;
  } else if (course_group === 2) {
    r = 3;
  } else if (course_group === 3) {
    r = 3;
  } else {
    r = 0;
  }
  return r;
};

exports.genderFormat = (value) => {
  let type;
  if (String(value) === "1") {
    type = "ชาย";
  } else if (String(value) === "2") {
    type = "หญิง";
  } else {
    type = "-";
  }
  return type;
};

exports.ymdtodmy = (value) => {
  // 2022-08-31 to 31/08/2022
  const [year, month, day] = value.split("-");
  return day + "/" + month + "/" + year;
};

exports.dmytoymd = (value) => {
  // 31/08/2022  to 2022-08-31
  const [day, month, year] = value.split("/");
  return year + "-" + month + "-" + day;
};

exports.format_date_time = (value) => {
  // 2022-08-02T17:06:30.534767 to 02/08/2022 | 17:06
  if (value === undefined) {
    return false;
  }
  const myArr = value.split("T");
  const date = myArr[0];
  const time = myArr[1];

  const dateArr = date.split("-");
  const timeArr = time.split(":");

  var year = dateArr[0];
  var month = dateArr[1];
  var day = dateArr[2];
  var timeFormat = timeArr[0] + ":" + timeArr[1];
  return day + "/" + month + "/" + year + "  , " + timeFormat;
};

exports.vehicle_type_format = (value) => {
  let index = value - 1;
  return exports.vehicle_type[index];
};
exports.months = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
exports.months_th_mini = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];
exports.subject_learn_type = ["ทฤษฎี", "ปฏิบัติ"];
exports.unit_type = ["รายชั่วโมง", "รายวัน", "รายเดือน", "รายคน"];
exports.amount_type = ["สอน", "คุมสอบ", "กรรมการ", "ประธาน", "เงินเดือน"];

exports.get_year = (start_year) => {
  let result = [];
  // let start_year = new Date().getFullYear();

  let last_year = parseInt(start_year) + 3;
  for (let i = start_year; i <= last_year; i++) {
    // console.log(i);
    result.push(i);
  }
  return result;
};
// loop time data

exports.time_list = () => {
  var i;
  var hours = 0;
  function pad2(number) {
    const num = number.toString();
    return (num < 10 ? "0" : "") + num;
  }
  var obj = [];
  const minute_zero = ":00:00";
  const minute_half = ":30:00";
  for (i = hours; i < 24; i++) {
    var hour = pad2(i) + minute_zero;
    var hour_half = pad2(i) + minute_half;
    // console.log(hour);
    // console.log(hour_half);
    obj.push(hour, hour_half);
  }
  // console.log(obj);
  return obj;
};
exports.timetotimestamp = (time) => {
  // time  HH:MM
  const hms = time;
  const [hours, minutes] = hms.split(":");
  const totalSeconds = +hours * 60 * 60 + +minutes * 60;
  return totalSeconds;
};
exports.formatnumberWithcomma = (value) => {
  let n = value;
  let str = n.toLocaleString("en-US");
  // console.log(str); // "234,234,234"
  return str;
};
exports.time_diff = (starttime, endtime) => {
  let hmsStart = starttime; // your input string  format to 10.30 > 10.30:00
  let aStart = hmsStart.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  // var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
  let secondsStart = +aStart[0] * 60 * 60 + +aStart[1] * 60 + +aStart[2];

  let hmsEnd = endtime; // your input string
  let aEnd = hmsEnd.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  let secondsEnd = +aEnd[0] * 60 * 60 + +aEnd[1] * 60 + +aEnd[2];

  let delta = secondsEnd - secondsStart;
  let hours = delta / (60 * 60);
  // console.log(hoursEnd);

  return hours;
};

exports.getDaysInMonth = (date) => {
  let [year, month] = String(date).split("-");
  let firstday = "01";

  let set = month - 1;
  let lastday = new Date(year, set + 1, 0).getDate();

  let start = year + "-" + month + "-" + firstday;
  let end = year + "-" + month + "-" + lastday;
  return [start, end];
  // return ["2022-10-01", "2022-10-31"];
};

exports.add_hour = (starttime, hours) => {
  let [hh, mm, ss] = starttime.split(":");

  const seconds = hours * 60 * 60;

  ss = ss * 1 + seconds;
  if (ss >= 60) {
    mm = mm * 1 + ss / 60;
    ss = (ss % 60).toPrecision(2).padStart(2, "0");
  }

  if (mm >= 60) {
    hh = hh * 1 + mm / 60;
    mm = (mm % 60).toPrecision(2).padStart(2, "0");
  }
  let mmc = mm === "0.0" ? "00" : mm;
  let ssc = ss === "0.0" ? "00" : ss;
  hh = (Math.floor(hh) % 24).toString().padStart(2, "0");
  // return hh + ':' + mm + ':' + ss;
  return hh + ":" + mmc + ":" + ssc;
};
exports.addHourEndDate = (startdatetime, hour) => {
  // 2022-09-19T07:30:00+07:00
  let [date, time] = startdatetime.split("T");
  let [year, month, day] = date.split("-");
  let timepure = time.split("+")[0]; //09:00:01+07:00 to 09:00:01
  let enddatetime = exports.add_hour(timepure, hour);
  let hour_start = timepure.split(":")[0];
  let hour_end = enddatetime.split(":")[0];
  // เช็คดูว่าเวลาชั่วโมงเกินเที่ยงคืนหรือไม่ ถ้าเกินให้บวกวันที่ไปอีก 1 วัน
  var newday;
  if (hour_start > hour_end) {
    newday = parseInt(day) + 1;
  } else {
    newday = parseInt(day) + 0;
  }

  return (
    year + "-" + month + "-" + exports.twoDigit(newday) + "T" + enddatetime
  );
};
exports.LongDatetoShortDate = (value) => {
  // const dt = new Date("Tue Sep 27 2022 16:00:00 GMT+0700 (Indochina Time)");
  const dt = new Date(value);
  const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
  const formatSet = `${padL(dt.getMonth() + 1)}/${padL(
    dt.getDate()
  )}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}`;
  return formatSet;
};
exports.twoDigit = (value) => {
  let num = parseInt(value);
  let f;
  if (num < 10) {
    f = "0" + String(num);
  } else {
    f = num;
  }
  return f;
};

exports.LongDatetoShortDateISO = (value) => {
  // let yourDate = new Date("Wed Oct 12 2022 11:00:00 GMT+0700 (Indochina Time)");
  let yourDate = new Date(value);
  // Get year, month, and day part from the date

  // let text = yourDate.toLocaleString("en-US");
  let year = yourDate.getFullYear();
  let month = yourDate.getMonth() + 1;
  month = ("0" + month).slice(-2);
  let date = yourDate.getDate();
  date = ("0" + date).slice(-2);

  let hour = yourDate.getHours();
  hour = ("0" + hour).slice(-2);
  let minute = yourDate.getMinutes();
  minute = ("0" + minute).slice(-2);
  let second = yourDate.getSeconds();
  second = ("0" + second).slice(-2);
  const time = `${year}-${exports.twoDigit(month)}-${exports.twoDigit(
    date
  )} ${hour}:${minute}:${second}`;
  // console.log(time);
  return time;
};
exports.formatd = (datetime) => {
  // 2022-10-05T15:49:47.507770 to 05/10/2022 15:49
  let data = String(datetime);
  let [date, time] = data.split("T");
  let [year, month, day] = date.split("-");
  let [hour, i] = time.split(":");
  return day + "/" + month + "/" + year + " " + hour + ":" + i;
};
exports.randomCode = () => {
  var pwdChars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var pwdLen = 10;
  var randomstring = Array(pwdLen)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  return randomstring;
};

exports.valNan = (value) => {
  return isNaN(value) ? 0 : value;
};

export default exports;

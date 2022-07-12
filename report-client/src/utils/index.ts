import moment from "moment";

export const InsuranceNumber = (number: number, minLength = 2) => {
  const len = number.toString().length;
  if (len < minLength) {
    return "0".repeat(minLength - len) + number;
  }
  return number;
};

export const getFormattedTime = (start = 0, end: number) => {
  const duration = moment.duration(end - start);
  const hour = InsuranceNumber(duration.hours());
  const min = InsuranceNumber(duration.minutes());
  const sec = InsuranceNumber(duration.seconds());
  const msec = InsuranceNumber(duration.milliseconds(), 3);
  let node;
  if (hour !== "00") {
    node = `${hour}:${min}:${sec}.${msec}`;
  } else if (min !== "00") {
    node = `${min}:${sec}.${msec}`;
  } else if (sec !== "00") {
    node = `${min}:${sec}.${msec}`;
  } else {
    node = `${min}:${sec}.${msec}`;
  }
  return node;
};

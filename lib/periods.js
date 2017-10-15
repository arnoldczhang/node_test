const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

module.exports = {
  second: (n = 1) => SECOND * n,
  minute: (n = 1) => MINUTE * n,
  hour: (n = 1) => HOUR * n,
  day: (n = 1) => DAY * n,
  week: (n = 1) => WEEK * n,
  monthRough: (n = 1) => WEEK * 4.3 * n,
  yearRough: (n = 1) => DAY * 365.25 * n,
};

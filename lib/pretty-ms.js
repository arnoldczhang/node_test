/**
 * 
log(prettyMs(1337000000));
//=> '15d 11h 23m 20s'

log(prettyMs(1337, {
  secDecimalDigits: 1,
}));
//=> '1.3s'

log(prettyMs(133));
//=> '133ms'
log(prettyMs(13333333.33333, {
  msDecimalDigits: 1
}));

// compact option
log(prettyMs(1337, {compact: true}));
//=> '~1s'

// verbose option
log(prettyMs(1335660900, {verbose: true}));
log(prettyMs(133566901900, {
  secDecimalDigits: 20,
  msDecimalDigits: 10
}));

log(prettyMs(2000, {
  compact: true
}));
//=> '15 days 11 hours 1 minute 9 seconds'

// can be useful for time durations
log(prettyMs(new Date(2014, 0, 1, 10, 40) - new Date(2014, 0, 1, 10, 5)))
 *
 **/

const ZERO = 0;
const MILL = 1;
const SECOND = MILL * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365;

const defaultConfig = {
  secDecimalDigits: 1,
  msDecimalDigits: 0,
  compact: false,
  verbose: false,
};

const per = {
  YEAR,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILL,
};

const verboseUnit = {
  YEAY: 'year',
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  MILL: 'millisecond',
};

const unverboseUnit = {
  YEAR: 'y',
  DAY: 'd',
  HOUR: 'h',
  MINUTE: 'm',
  SECOND: 's',
  MILL: 'm',
};

const isNumeric = (num) => typeof num === 'number';
const getUnit = (num, unit, per, precise = ZERO) => {
  const isVUnit = unit.length > 1;
  let result = (num / per).toFixed(precise);
  return `${result}${isVUnit ? ' ' + unit : unit}${isVUnit && result > 1 ? 's' : ''}`;
};

module.exports = (input, opts = defaultConfig) => {
  opts = Object.assign({}, defaultConfig, opts);
  const inputArr = [];
  const unit = opts.verbose ? verboseUnit : unverboseUnit;
  const msArr = ['YEAR', 'DAY', 'HOUR', 'MINUTE', 'SECOND'];

  if (!isNumeric(input)) input = Number(input);
  if (isFinite((input))) {
    if (input === ZERO) return ZERO.toFixed(1);
    if (input < SECOND) return getUnit(input, unit.MILL, per.MILL, opts.msDecimalDigits);

    for (let i = ZERO, len = msArr.length; i < len; i += 1) {
      if (!input) break;
      let item = msArr[i];
      let perunit = per[item];

      if (i < len - 1) {
        if (input > perunit) {
          inputArr.push(getUnit(input, unit[item], perunit));
          input = input % perunit;
        }
      }

      else {
       opts.secDecimalDigits = input % SECOND ? opts.secDecimalDigits : ZERO;
        inputArr.push(getUnit(input, unit[item], perunit, opts.secDecimalDigits));
      }
    }

    if (opts.compact) return `~${parseInt(inputArr[0], 10) + inputArr[0].split(/[\d\.]+/)[1]}`;
    return inputArr.join(' ');
  }
  throw new Error('expect a finite number');
};

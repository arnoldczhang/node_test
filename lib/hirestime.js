/**
const hirestime = require('./lib/hirestime')

//startpoint of the time measurement
const getElapsed = hirestime()

setTimeout(_ => {
    //returns the elapsed milliseconds
    console.log(getElapsed(hirestime.MS))
}, 1000)
 */
/**
process.hrtime([pretime]) => [秒, 纳秒]; // 计算与之前时间相差的差值：秒 + 纳秒的和
纳秒 * 10e9 = 秒
 */
const S = 'S';
const MS = 'MS';
const NS = 'NS';

const round = num => Math.round(num * 100) / 100;

const hirestimeBrowser = () => {
  const startTime = Date.now();
  return (type = MS) => {
    const now = Date.now();
    let elapsed = now - startTime;
    return round(timeMap[type] * elapsed);
  };
};

const hirestimeNode = () => {
  const startTime = process.hrtime();
  return (type = MS) => {
    const elapsed = process.hrtime(startTime);
    if (type === S) {
      return round(elapsed[0] + elapsed[1] / 1e9);
    }

    else if (type === NS) {
      return round(elapsed[0] * 1e9 + elapsed[1]);
    }
    return round(elapsed[0] * 1e3 + elapsed[1] / 1e6);
  };
};

const timeMap = {
  [S]: 1 / 1000,
  [MS]: 1,
  [NS]: 1000 * 1000,
};

module.exports = process.hrtime ? hirestimeNode : hirestimeBrowser;
module.exports.S = S;
module.exports.MS = MS;
module.exports.NS = NS;
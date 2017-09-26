const isNumber = require('./isNumber');

const getNum = (array, idx) => {
  if ('length' in array) {
    const length = array.length;
    if (isNumber(idx)) {
      idx = +idx >> 0;
      if (idx >= length) {
        return length;
      }

      else if (idx >= 0) {
        return idx;
      }
      idx = idx + length;
      return idx < 0 ? 0 : idx;
    }
    return 0;
  }

  else {
    throw new TypeError('args[0] must be an arraylike object');
  }
};

// 1
// '1'
// NaN
// Infinity
// -1
// 1000000
// 1.212
// 
module.exports = (array, start = 0, end) => {
  var arr = [];
  if ('length' in array) {
    const length = array.length;
    start = Math.max(getNum(array, start), 0);
    end = typeof end != 'undefined' ? end : length;
    end = Math.min(getNum(array, end), length);
    for ( ; start < end; start += 1) {
      arr.push(array[start]);
    }
    return arr;
  }

  else {
    throw new TypeError('args[0] must be an arraylike object');
  }
};
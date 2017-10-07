const longest = require('./longest');
const rightpad = require('./right-pad');

module.exports = (object) => {
  let keyArr;
  let maxLen;
  let result = {};
  if (typeof object === 'object') {
    keyArr = Object.keys(object);
    maxLen = longest(keyArr).length;
    keyArr.forEach((key) => {
      let _key = rightpad(key, maxLen);
      result[_key] = object[key];
    });
    return result;
  }

  else {
    throw new Error('right-pad-keys expects an object');
  }
};

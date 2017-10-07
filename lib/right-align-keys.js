const align = require('./align-text');

module.exports = (object) => {
  let keyArr;
  let result = {};
  if (typeof object === 'object') {
    keyArr = align(Object.keys(object));
    keyArr.forEach(key => result[key] = object[key.trim()]);
    return result;
  }

  else {
    throw new Error('right-align-keys expects an object');
  }
};
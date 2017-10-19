const split = require('./split-string');
const get = require('./get-value');
const isObject = require('./isobject');
const hasValues = require('./hasValues');

module.exports = (...args) => {
  const argsLen = args.length;
  if (!argsLen) return false;
 
  let object = args[0];
  if (argsLen === 1) {
    return !(Array.isArray(object) && !(0 in object) || object === '');
  }
  
  let props = args[1];
  let noZero = args[2];

  if (isObject(object)) {
    return hasValues(get(object, props), noZero);
  }
  return hasValues(object, props);
};

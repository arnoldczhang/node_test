const split = require('./split-string');
const isObject = (object) => Object.prototype.toString.call(object) === '[object Object]';

module.exports = (object, prop, value) => {
  const propArr = split(prop);
  let key;
  while (key = propArr.shift()) {
    
    if (propArr.length) {
      if (!isObject(object[key])) {
        object[key] = {};
      }
      object = object[key];
    }

    else {
      object[key] = value;
    }
  }
  return object;
};

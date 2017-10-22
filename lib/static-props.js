/*
const staticProps = require('./lib/static-props');

const obj = {};

const aa = 'abc';
const bfunc = (val) => val.toLowerCase();

staticProps(obj)({aa, bfunc});
log(obj);
 */
const isFunction = (func) => typeof func === 'function';

module.exports = (object) => {
  return (props, enumerable = true) => {
    const configurable = false;
    const desc = {};

    Object.keys(props).forEach((key) => {
      const map = desc[key] = {
        configurable,
        enumerable,
      };

      if (isFunction(props[key])) {
        map.get = props[key];
      }

      else {
        map.value = props[key];
        map.writable = false;
      }
    });
    Object.defineProperties(object, desc);
    return object;
  };
};

/*
const filterObj = require('./lib/filter-obj');

const obj = {
  foo: true,
  bar: false
};

// { foo: true }
// { bar: false }
// {}

log(filterObj(obj, (key, value) => value === true));
log(filterObj(obj, ['bar']));
log(filterObj(1));
 */
const arrayFilter = (array) => (key, value) => array.indexOf(key) !== -1;

module.exports = (object, filter) => {
  const result = {};
  if (typeof object === 'object') {
    let isArray = Array.isArray(filter);
    if (isArray || typeof filter === 'function') {
      if (isArray) filter = arrayFilter(filter);
      Object.keys(object)
        .filter(key => filter(key, object[key]))
        .forEach(key => result[key] = object[key]);
    }
  }
  return result;
};

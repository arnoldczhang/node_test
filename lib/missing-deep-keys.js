/*
const missingDeepKeys = require('missing-deep-keys');

const o1 = {a: {b: 2}, d: {aa: {d:1}}, c: 'ddd'}; // Base object
const o2 = {c: 1}; // Comparison object

log(missingDeepKeys(o1, o2));
log(missingDeepKeys(o1, o2, true));

 */
const flatKeys = require('./lib/flatKeys');

module.exports = (o1, o2, deep = false) => {
  const o1Keys = flatKeys(o1);
  const o2Keys = flatKeys(o2);
  const result = o1Keys.reduce((keys, key) => {
    if (o2Keys.indexOf(key) === -1) keys[keys.length] = key;
    return keys;
  }, []);

  if (deep) {
    return result.reduce((keys, key) => {
      const before = -1;
      let index;
      while ((index = key.indexOf('.', before)) !== -1) {
        keys[keys.length] = key.substr(0, index);
        before = index;
      }
      return keys;
    }, result);
  }
  return result;
};

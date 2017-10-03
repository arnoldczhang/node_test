const mapObj = require('./map-obj');
const noop = val => val;

module.exports = (object, iterator = noop) => {
  const array = [];
  if (object == null) {
    throw new Error('');
  }

  let index = 0;
  const res = mapObj(object, (key, value) => [index++, iterator(key, value)]);
  res.length = index;
  return Array.from(res);
};

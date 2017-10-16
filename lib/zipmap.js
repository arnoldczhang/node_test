/*
var zipmap = require('./lib/zipmap');

var keys = ['a', 'b', 'c', 'd'];
var vals = [1, 2, 3];

log(zipmap(keys, vals));

var objs = [
  { key: 'foo', value: 'bar' },
  { key: 'hi', value: 'bye' },
];

// var out = {
//   foo: 'bar',
//   hi: 'bye'
// };

log(zipmap(objs));


var pairs = [
  ['foo', 'bar'],
  ['hi', 'bye']
];

// var out = {
//   foo: 'bar',
//   hi: 'bye'
// };

log(zipmap(pairs));
log(zipmap([
  { key: 'foo', value: 'bar' },
  { key: 'hi', value: 'bye' },
  ['foo', 'bar'],
  ['hi', 'bye'],
]));
 */
const isObject = (object) => Object.prototype.toString.call(object) === '[object Object]';

module.exports = (keys, values) => {
  const argsLen = args.length;
  if (!values) {
    const isKeyArr = Array.isArray(keys);
    if (!isKeyArr || (isKeyArr && !keys.length)) return {};
    let keyArr = keys[0];
    
    if (Array.isArray(keyArr)) {
      return keys.reduce((result, item) => {
        result[item[0]] = item[1];
        return result;
      }, {});
    }

    if (isObject(keyArr)) {
      return keys.reduce((result, item) => {
        if ('key' in item) result[item.key] = item.value;
        return result;
      }, {});
    }
    throw new Error('Expect keys to be an array');
  }

  const valueLen = values.length;
  return keys.reduce((result, key, index) => {
    if (index < valueLen) result[key] = values[index];
    return result;
  }, {});
};

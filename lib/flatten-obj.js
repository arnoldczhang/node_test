/*
var flatten = require('./lib/flatten-obj')()

var obj = {
  foo: {
    bar: 1
  }
}

// outputs `{ 'foo.bar': 1 }`
console.log(flatten(obj))

var flatten = require('flatten-obj')({ separator: '/' })

var obj = {
  foo: {
    bar: 42
  }
}

// outputs `{ 'foo/bar': 42 }`
console.log(flatten(obj))


var flatten = require('flatten-obj')({ onlyLeaves: true })

var obj = {
  sub: {
    foo: 1,
    bar: {
      baz: 2
    }
  }
}

// outputs `{ foo: 1, baz: 2 }`
console.log(flatten(obj))
 */
const isExtendable = require('./is-extendable');
const extend = require('./extend-shallow');
const isObject = (object) => isExtendable(object) || Array.isArray(object);
const defaultOpts = {
  separator: '.',
  onlyLeaves: false,
};

const flatten = (object, opts, entity = {}, pre = '') => {
  return Object.keys(object).reduce((keys, key) => {
    const flatKey = opts.onlyLeaves ? key : `${pre}${pre ? opts.separator : ''}${key}`;
    const value = object[key];
    isObject(value)
      ? extend(keys, flatten(value, opts, {}, flatKey))
      : (keys[flatKey] = value);
    return keys;
  }, entity);
};

module.exports = (opts = defaultOpts) => {
  opts = extend({}, defaultOpts, opts);
  return (object) => {
    let result = {};
    flatten(object, opts, result);
    return result;
  };
};

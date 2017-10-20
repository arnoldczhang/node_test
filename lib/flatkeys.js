/*
let flatKeys = require('./lib/flatKeys');
const keys = {
    zero: {
        one: 1,
        two: {
            three: 3
        }
    }
};
log(flatKeys(keys));

log(flatKeys(keys, {
    sep    : '_',         // separator
    snake  : true,        // convert keys from camelCase to snake_case
    filter : String.prototype.toUpperCase, // transformation function, defaults to `String.prototype.toLowerCase`
}));

log(flatKeys(keys, {
    sep    : '[',         // separator
    snake  : false,        // convert keys from camelCase to snake_case
    // filter : String.prototype.toUpperCase, // transformation function, defaults to `String.prototype.toLowerCase`
}));

log(flatKeys(1)) // []
 */
const toCamel = require('./to-camel-case');
const isExtendable = require('./is-extendable');
const extend = require('./extend-shallow');
const isObject = (object) => isExtendable(object) || Array.isArray(object);
const push = Array.prototype.push;

const defaultOpts = {
  sep: '_',
  snake: true,
  filter: String.prototype.toLowerCase,
};

// NO.1
// const flattenKey = (object, sep, entity = [], pre = '') => {
//   if (isObject(object)) {
//     const keys = Object.keys(object);
//     const flatedKey = keys.map(key => `${pre}${pre ? sep : ''}${key}`);
//     keys.forEach((key, i) => {
//       flattenKey(object[key], sep, entity, flatedKey[i]);
//     });
//   }

//   else {
//     push.call(entity, pre);
//   }
//   return entity;
// };

// NO.2
const flattenKey = (object, sep, entity = [], pre = '') => {
  return Object.keys(object).reduce((keys, key) => {
    const flatKey = `${pre}${pre ? sep : ''}${key}`;
    isObject(object[key])
      ? push.apply(keys, flattenKey(object[key], sep, [], flatKey))
      : push.call(keys, flatKey); 
    return keys;
  }, entity);
};

module.exports = (keys, opts = defaultOpts) => {
  let result = [];
  opts = extend({}, defaultOpts, opts);
  flattenKey(keys, opts.sep, result);

  if (typeof opts.filter === 'function') {
    result = result.map(res => opts.filter.call(res));
  }

  if (!opts.snake) {
    result = result.map(res => toCamel(res));
  }
  return result;
};

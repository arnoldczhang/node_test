/*
var hasKeyDeep = require('./lib/has-key-deep');

log(hasKeyDeep({ a: { b: { c: 1 } } }, 'a.b.c'));
log(hasKeyDeep({ a: { b: { c: 1 } } }, ['a', 'b', 'c']));
log(hasKeyDeep({ a: { b: { c: 1 } } }, 'a.b.c.d'));
log(hasKeyDeep({ a: { b: { c: 1 } } }, 'a.c'));
log(hasKeyDeep({}, 'a'));
var hasABC = hasKeyDeep('a.b.c');
log(hasABC({a: { b: { c: 1 } } }));
log(hasABC({a: 1 }));
 */
const get = require('./get-value');
const isObject = require('./isobject');

const hasKeyDeep = (object, props) => {
  if (isObject(object)) {
    const result = get(object, props);
    if (result === undefined) {
      return false;
    }
    return true;
  }

  else if (typeof object === 'string') {
    return (o, p = object) => hasKeyDeep(o, p);
  }
};

module.exports = hasKeyDeep;

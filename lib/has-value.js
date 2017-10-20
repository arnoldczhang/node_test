/*
log(1)
log(hasValue('foo'));
log(hasValue({foo: 'bar'}, 'foo'));
log(hasValue({a: {b: {c: 'foo'}}}, 'a.b.c'));
//=> true
log(2)
log(hasValue(''));
log(hasValue({foo: ''}, 'foo'));
log(hasValue({foo: null}, 'foo'));
//=> false
log(3)
log(hasValue(0));
log(hasValue(1));
log(hasValue({foo: 0}, 'foo'));
log(hasValue({foo: 1}, 'foo'));
log(hasValue({foo: {bar: 'a'}}, 'foo'));
log(hasValue({foo: {bar: 'a'}}, 'foo.bar'));
//=> true
log(4)
log(hasValue({foo: {}}, 'foo'));
log(hasValue({foo: {bar: {}}}, 'foo.bar'));
log(hasValue({foo: undefined}, 'foo'));
//=> false
log(5)
log(hasValue([]));
log(hasValue([[]]));
log(hasValue([[], []]));
log(hasValue([undefined]));
log(hasValue({foo: []}, 'foo'));
//=> false
log(6)
log(hasValue([0]));
log(hasValue([null]));
log(hasValue(['foo']));
log(hasValue({foo: ['a']}, 'foo'));
//=> true
log(7)
log(hasValue(function() {}));
log(hasValue(function(foo) {}));
log(hasValue({foo: function(foo) {}}, 'foo'));
log(hasValue({foo: function() {}}, 'foo'));
//=> true
log(8)
log(hasValue(true));
log(hasValue(false));
log(hasValue({foo: true}, 'foo'));
log(hasValue({foo: false}, 'foo'));
//=> true

 */
const split = require('./split-string');
const get = require('./get-value');
const isObject = require('./isobject');
const hasValues = require('./has-values');

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

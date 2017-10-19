/*
var obj = {};
set(obj, 'a.b.c', 'd');
console.log(obj);
//=> { a: { b: { c: 'd' } } }

console.log(set({}, 'a\\.b.c', 'd'));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, 'a\\.b\\.c', 'd'));
//=> { 'a.b.c': 'd' }

console.log(set({}, '"a.b".c', 'd'));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, "'a.b'.c", "d"));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, '"this/is/a/.file.path"', 'd'));
//=> { 'this/is/a/file.path': 'd' }

console.log(set({}, '[a.b].c', 'd'));
//=> { '[a.b]': { c: 'd' } }

console.log(set({}, "(a.b).c", "d"));
//=> { '(a.b)': { c: 'd' } }

console.log(set({}, "<a.b>.c", "d"));
//=> { '<a.b>': { c: 'd' } }

console.log(set({}, "{a..b}.c", "d"));
//=> { '{a..b}': { c: 'd' } }

console.log(set({}, "{a..b}.c", {aaaaa: '123123123'}));
//=> { '{a..b}': { c: { aaaaa: '123123123' } } }
 */
const split = require('./split-string');
const isPlainObject = require('./is-plain-object');
const isObject = require('./isobject');
const isExtendable = require('./is-extendable');
const extend = require('./extend-shallow');

module.exports = (object, prop, value) => {
  const propArr = split(prop);
  let _object = object;
  let key;
  while (key = propArr.shift()) {
    
    if (propArr.length) {
      if (!isExtendable(object[key])) {
        _object[key] = {};
      }
      _object = _object[key];
    }

    else {
      if (isPlainObject(_object[key]) && isPlainObject(value)) {
        extend(_object[key], value);
      }

      else {
        _object[key] = value;
      }
    }
  }
  return object;
};

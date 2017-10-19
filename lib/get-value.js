/*
var get = require('./lib/get-value');

var obj = {a: {b : {c: {d: 'foo'}}}, e: [{f: 'g'}]};
log(get(obj, 'a.b.c'));
//=> {d: 'foo'}

log(get(obj, 'a.b.c.d'));
//=> 'foo'

// works with arrays
log(get(obj, 'e.0.f'));
//=> 'g'

var obj = {'foo/bar.md': {b: 'c'}};
log(get(obj, 'foo/bar\\.md'));
//=> {b: c}

var obj = {a: {b: 'c'}};
log(get(obj, ['a', 'b']));
//=> 'c'
 */
const split = require('./split-string');
const isPlainObject = require('./is-extendable');

module.exports = (object, props) => {
  const propsArr = Array.isArray(props) ? props : split(props);
  let _object = object;
  for (let i = 0, len = propsArr.length; i < len; i += 1) {
    let prop = propsArr[i];

    if (i !== len - 1) {
      if (isPlainObject(_object)) {
        _object = _object[prop];
      }
    }

    else {
      return _object[prop];
    }
  }
};

/*
===part1===
1.===
2.Date
3.not Object compare

===part2===
4.prototype
5.arguments
6.buffer
7.key length
8.key.sort() => key equal
9.deepEqual inner


var equal = require('./lib/deep-equal');
console.log([
    equal(
        { a : [ 2, 3 ], b : [ 4 ] },
        { a : [ 2, 3 ], b : [ 4 ] },
        {strict: true}
    ),
    equal(
        { x : 5, y : [6] },
        { x : 5, y : 6 }
    )
]);
 */
const isArgs = (args) => Object.prototype.toString.call(args) === '[object Arguments]';
const isBuffer = (buff) => {
  if (!buff || typeof buff !== 'object' || typeof buff.length !== 'number') return false;
  if (typeof buff.copy !== 'function' || typeof buff.slice !== 'function') return false;
  if (buff.length > 0 && typeof buff[0] !== 'number') return false;
  return true;
};
const isVoid0 = (target) => target == null;
const slice = (arrayLike) => Array.prototype.slice.call(arrayLike, 0);

const objectEqual = (target, other, opts = {}) => {
  if (target === other) return true;
  if (target instanceof Date && other instanceof Date) {
    return target.getTime() === other.getTime();
  }

  if (!target || !other ||
    typeof target !== 'object' && typeof other !== 'object') {
    return opts.strict ? target === other : target == other;
  }
  return deepEqual(target, other, opts);
};

const deepEqual = (target, other, opts = {}) => {
  if (isVoid0(target) || isVoid0(other)) return false;
  if (target.prototype !== other.prototype) return false;
  if (isArgs(target)) {
    if (!isArgs(other)) return false;
    target = slice(target);
    other = slice(other);
    return objectEqual(target, other, opts);
  }

  if (isBuffer(target)) {
    if (!isBuffer(other)) return false;
    if (target.length !== other.length) return false;
    for (let i = 0, len = target.length; i < len; i += 1) {
      if (target[i] !== other[i]) return false;
    }
    return true;
  }


  let targetKeys = Object.keys(target);
  let otherKeys = Object.keys(other);

  if (targetKeys.length !== otherKeys.length) return false;
  targetKeys.sort();
  otherKeys.sort();

  let len = targetKeys.length;
  for (let i = 0; i < len; i += 1) {
    if (targetKeys[i] !== otherKeys[i]) return false;
  }

  for (let i = 0; i < len; i += 1) {
    let tKey = targetKeys[i];
    if (!objectEqual(target[tKey], other[tKey], opts)) return false;
  }
  return true;
};

module.exports = objectEqual;
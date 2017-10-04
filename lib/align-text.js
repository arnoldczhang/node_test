// const {
//   log,
// } = require('./lib/proxy/utils');

// var txt = `Lorem ipsum dolor sit amet
// consectetur adipiscin
// elit, sed do eiusmod tempor incididun
// ut labore et dolor
// magna aliqua. Ut enim ad mini
// veniam, quis`;
// var align = require('align-text');
// log(align(txt, (len, longest, line, lines) => {
//   return {
//     character: '&',
//     indent: Math.floor((longest - len) / 2),
//     prefix: ' ',
//   };
// }));

// log(align(txt, (len, longest, line, lines) => {
//   return Math.floor((longest - len) / 2);
// }));

// log(align(txt, 1));
// log(align([1, 2, 13, 100]));
const repeat = require('./repeat-string');
const tolongest = require('./longest');

const isStringOrArray = (obj) => {
  return typeof obj === 'string' || Array.isArray(obj);
};

module.exports = (object, count) => {
  const noCount = typeof count === 'undefined';
  const isFunc = typeof count === 'function';
  const isArray = Array.isArray(object);
  if (isStringOrArray(object)) {

    if (!isFunc && !noCount) {
      count = Number(count);
    }
    let result = isArray ? object : object.split(/(?:\r\n|\n)/);
    let longest = tolongest(result).length;
    let lines = result.length;

    result = result.map(isFunc ? (child, index) => {
      const alignObj = count(child.length, longest, index, lines);

      if (isNaN(Number(alignObj))) {
        // object
        return (alignObj.prefix || '') + repeat(alignObj.character || ' ', alignObj.indent) + child;
      }

      else {
        // number
        return repeat(' ', alignObj) + child;
      }
    } : (child) => {
      if (noCount) {
        return repeat(' ', longest - child.length) + child
      }
      return repeat(' ', count) + child;
    });
    return isArray ? result : result.join('\n');
  }

  else {
    throw new Error('args[0] is expected to be a string or an array');
  }
};

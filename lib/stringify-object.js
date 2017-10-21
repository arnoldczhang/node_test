/*
const stringifyObject = require('./lib/stringify-object');

var obj = {
  foo: 'bar',
  'arr': [1, 2, 3],
  nested: { hello: "world\'" }
};

var pretty = stringifyObject(obj, {
  indent: '  ',
  singleQuotes: true,
  inlineCharacterLimit: 1,
  transform: (obj, prop, ori) => {
    return 'aa';
  },
});
 */
const extend = require('./extend-shallow');
const isArray = Array.isArray;
const isObject = (object) => typeof object === 'object' && object !== null;
const isNumber = (num) => typeof num === 'number';
const isString = (str) => typeof str === 'string';
const defaultOpts = {
  first: true,
  indent: '\t',
  singleQuotes: true,
  transform: (obj, prop, originVal) => originVal,
};
const Bracket = {
  PRE: 'prefix',
  ROOT: 'root',
};
let quote = '"';

const getBracket = (type, Ctor, indent) => {
  if (Ctor === Object) {
    return type === Bracket.PRE
      ? '{'
      : ('\n' + indent + '},\n');
  }

  else if (Ctor === Array) {
    return type === Bracket.PRE
      ? '['
      : '],\n';
  }
  return '';
};

const getArrayStr = (array, opts, indent) => {
  let result = '';
  let rootfix = getBracket(Bracket.ROOT, Array, indent);
  result += getBracket(Bracket.PRE, Array, indent);
  indent += opts.indent;
  result = array.reduce((res, val) => {
    res += stringify(val, opts, indent);
    return res;
  }, result);
  result = result.substr(0, result.length - 2);
  result += rootfix;
  return result;
};

const getObjectStr = (object, opts, indent) => {
  let result = '';
  let rootfix = getBracket(Bracket.ROOT, Object, indent);
  result += getBracket(Bracket.PRE, Object, indent);
  indent += opts.indent;
  result = Object.keys(object).reduce((res, key) => {
    if (isObject(object[key])) {
      res += '\n' + indent + key + ': ' + stringify(object[key], opts, indent);
    }

    else {
      res += '\n' + indent + key + ': ' + quote + opts.transform(object, key, stringify(object[key], opts, indent)) + quote + ', ';
    }
    return res;
  }, result);
  result = result.substr(0, result.length - 2);
  result += rootfix;
  return result;
};

const getNormStr = (str, opts, indent) => {
  if (!isString(str)) {
    return str + ', ';
  }
  return quote + str.replace(/(['"])/g, "\\$1") + quote + ', ';
};

const stringify = (input, opts = defaultOpts, indent = '', content = '') => {
  if (!opts.first) indent += opts.indent;
  opts.first = false;
  if (isObject(input)) {
    if (isArray(input)) {
      content += getArrayStr(input, opts, indent);
    }

    else {
      content += getObjectStr(input, opts, indent);
    }
  }

  else {
    content += getNormStr(input, opts, indent);
  }
  return content;
};


module.exports = (input, opts = defaultOpts) => {
  opts = extend({}, defaultOpts, opts);
  if (opts.singleQuotes) {
    quote = "'";
  }

  if (isObject(input)) {
    return stringify(input, opts);
  }
  return input;
};

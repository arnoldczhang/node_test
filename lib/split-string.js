const noop = (val) => val;
const defaultOpts = {
  sep: '.',
};

let bracketMap = {
  '(': ')',
  '{': '}',
  '[': ']',
};

const pointReg = /\./;
const slashReg = /\\/g;
const leftSplitReg = /([\(\{\[])/;
const rightSplitReg = /([\)\}\]])/;

const getSpliceReg = (array) => new RegExp('([' + array.map(it => `\\${it}`).join('') + '])');
const keepSlash = (str, i, opts = defaultOpts) => {
  return str[i + 1] === '\\';
};

module.exports = (string = '', opts = defaultOpts, func) => {
  if (typeof string !== 'string') {
    throw new Error('Expected a `string` as input');
  }

  if (typeof opts === 'function') {
    func = opts;
    opts = defaultOpts;
  }

  opts.sep = opts.sep || defaultOpts.sep;
  if (typeof opts.brackets === 'object') {
    bracketMap = opts.brackets;
    let leftSplitArr = Object.keys(bracketMap);
    leftSplitReg = getSpliceReg(leftSplitArr);
    let rightSplitArr = leftSplitArr.map(left => bracketMap[left]);
    rightSplitReg = getSpliceReg(rightSplitArr);
  }

  const strLen = string.length;
  const result = [];
  const needBracket = !!opts.brackets;
  const rightSplitObj = {};

  let index = -1;
  let arrVal = '';
  let expectedClose;
  let closeMap = {};
  let closeIndex;
  let letter;

  while (++index < strLen) {
    letter = string[index];

    if (letter === '\\') {
      arrVal += (keepSlash(string, index, opts) ? letter : '') + string[index + 1];
      ++index;
      continue;
    }

    if (needBracket) {
      expectedClose = bracketMap[letter];
      
      if (expectedClose) {
        closeIndex = closeMap[expectedClose];
        closeMap[expectedClose] = string.indexOf(expectedClose, closeIndex == null ? -1 : closeIndex);
      }
    }

    if (letter === opts.sep) {
      result[result.length] = arrVal;
      arrVal = '';
    }
  }
  return result;
};

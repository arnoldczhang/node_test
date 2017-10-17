const noop = () => {};
const defaultOpts = {
  sep: '.',
};

let bracketMap = {
  '(': ')',
  '{': '}',
  '[': ']',
};

const slashReg = /\\/;
const pointReg = /\./;
const leftSplitReg = /([\(\{\[])/;
const rightSplitReg = /([\)\}\]])/;

const getSpliceReg = (array) => new RegExp('([' + array.map(it => `\\${it}`).join('') + '])');

module.exports = (string = '', opts = defaultOpts, func) => {
  if (typeof string !== 'string') {
    throw new Error('Expected a `string` as input');
  }

  if (typeof opts === 'function') {
    func = opts;
    opts = defaultOpts;
  }

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
  const rightSplitNeedArr = [];

  let index = 0;
  let lastIndex = 0;

  while (index < strLen) {
    let letter = string[index];
    if (letter === '\\') {
      index += 2;
      continue;
    }

    if (needBracket) {
      if (leftSplitReg.test(letter)) {
        let rightSp = bracketMap[letter];
        if (string.substr(index + 1).indexOf(rightSp) !== -1) {
          rightSplitNeedArr.push(rightSp);
        }
      }
      if (rightSplitReg.test(letter)) {}
    }

    if (letter === opts.sep) {
      result.push(string.substr(lastIndex, index - lastIndex));
      lastIndex = ++index;
    }
    index++;
  }
  result.push(string.substr(lastIndex));
  return result;
};

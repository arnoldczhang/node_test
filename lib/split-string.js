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
const toValue = (string) => string.replace(slashReg, '');

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

  let index = 0;
  let lastIndex = 0;
  let rightSplitLetter;
  let gapIndex;
  let latestRightSplit;
  let rightIndex;
  let maxRightIndex = -1;


  while (index < strLen) {
    let letter = string[index];

    if (letter === '\\') {
      index += 2;
      continue;
    }

    if (needBracket) {
      if (leftSplitReg.test(letter)) {
        latestRightSplit = letter;
        rightSplitLetter = bracketMap[letter];
        rightIndex = rightSplitObj[rightSplitLetter];
        rightIndex = string.indexOf(rightSplitLetter, rightIndex == null ? -1 : rightIndex);
        // maxRightIndex = Math.max(maxRightIndex, rightIndex);
        // console.log(rightSplitLetter, maxRightIndex);
        rightSplitObj[rightSplitLetter] = rightIndex; // getLastIndex(rightSplitObj[rightSplitLetter], string, rightSplitLetter, rightIndex);
      }

      else if (rightSplitReg.test(letter)) {
        rightSplitObj[letter] = -1;
      }
    }

    if (letter === opts.sep) {
      gapIndex = index - lastIndex;

      // console.log(index, letter, maxRightIndex, rightSplitObj[rightSplitLetter], string[6]);
      if (needBracket) {
        rightIndex = rightSplitObj[rightSplitLetter];
        if (index > rightIndex) {
          let valueOf = rightIndex === -1 ? toValue : noop;
          result.push(valueOf(string.substr(lastIndex, gapIndex)));
          lastIndex = ++index;
        } 

        // else if (index >= maxRightIndex) {
        //   result.push(string.substr(lastIndex, gapIndex));
        //   lastIndex = ++index;
        // }
      }

      else {
        result.push(toValue(string.substr(lastIndex, gapIndex)));
        lastIndex = ++index;
      }
    }
    index++;
  }
  result.push(string.substr(lastIndex));
  return result;
};

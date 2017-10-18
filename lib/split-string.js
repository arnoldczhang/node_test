const noop = (val) => val;
const defaultOpts = {
  sep: '.',
  brackets: true,
};

let bracketMap = {
  '(': ')',
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
  '<': '>',
};

let bracketCloseMap = {};

const pointReg = /\./;
const slashReg = /\\/g;
const leftSplitReg = /([\(\{\[])/;
const rightSplitReg = /([\)\}\]])/;
const quoteReg = /['"]/;

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
  let openMap = {};
  let closeMap = {};
  let closeIndex;
  let lastCloseIndex;
  let letter;

  Object.keys(bracketMap).forEach((key) => {
    bracketCloseMap[bracketMap[key]] = key;
  });

  const withinSpliter = (index) => {
    const maxOpenMap = {};
    const indexArr = Object.keys(openMap).map((open) => {
      const openValue = openMap[open];
      const openIndex = openValue[openValue.length - 1];
      maxOpenMap[openIndex] = open;
      return openIndex;
    });
    const latestOpenIndex = indexArr.length ? Math.max.apply(null, indexArr) : Infinity;
    if (latestOpenIndex <= index) {
      let closeArr = closeMap[bracketMap[maxOpenMap[latestOpenIndex]]];
      return index <= Math.max.apply(null, closeArr);
    }
    return false;
  };

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
        openMap[letter] = openMap[letter] || [];
        closeMap[expectedClose] = closeMap[expectedClose] || [];
        closeIndex = closeMap[expectedClose];
        lastCloseIndex = closeIndex[closeIndex.length - 1];
        openMap[letter].push(index);
        closeIndex.push(string.indexOf(expectedClose, lastCloseIndex == null ? 1 : (lastCloseIndex + 1)));
      }
    }

    if (letter === opts.sep) {
      if (needBracket) {
        if (withinSpliter(index)) {
          arrVal += letter;
          continue;
        }

        else {
          result[result.length] = arrVal;
          arrVal = '';
        }
      }

      else {
        result[result.length] = arrVal;
        arrVal = '';
      }
    }

    else if (quoteReg.test(letter)) {
      ;
    }

    else {
      arrVal += letter;
    }
  }
  result[result.length] = arrVal;
  return result;
};

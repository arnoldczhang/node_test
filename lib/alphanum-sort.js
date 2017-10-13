/**
 var sort = require('alphanum-sort');
var sort2 = require('./lib/alphanum-sort');
var arr = [' item20', 'item1 9', 'item1', 'item10', 'item2'];
var arr2 = [' item20', 'Item19', 'item1', 'item10', 'item2'];
var arr3 = [' item20', 'Item19', 'Uitem1', 'item10', 'item2'];
log(sort(arr));
log(sort2(arr));

log(sort(arr2));
log(sort2(arr2));

log(sort(arr3));
log(sort2(arr3));
 */

const isString = (str) => typeof str === 'string';
const isSpace = (code) => code === 32;
const isNumeric = (code) => code >= 48 && code <= 57;
const isCapital = (code) => code >= 65 && code <= 90;
const isInDiffCase = (pc, nc) => Math.abs(pc - nc) > 25 || isCapital(pc) || isCapital(nc);

const alphaSort = (pre = '', next = '') => {
  if (!isString(pre)) pre = String(pre);
  if (!isString(next)) next = String(next);
  if (this.insensitive) {
    pre = pre.toLowerCase();
    next = next.toLowerCase();
  }

  let pi = 0;
  let ni = 0;
  let pchar;
  let nchar;
  let pl;
  let nl;

  while (isSpace(pre.charCodeAt(pi))) pi++;
  while (isSpace(next.charCodeAt(ni))) ni++;

  pl = pre.substr(pi).length;
  nl = next.substr(ni).length;

  const prelonger = pl > nl ? 1 : pl === nl ? 0 : -1;
  while (true) {
    pchar = pre.charCodeAt(pi);
    nchar = next.charCodeAt(ni);

    if (isNaN(pchar) || isNaN(nchar)) {
      return !prelonger ? 0 : prelonger > 0 ? 1 : -1;
    }

    if (!isSpace(pchar) && !isSpace(nchar)) {
      if (isInDiffCase(pchar, nchar)) {
        return pchar - nchar;
      }
      
      if (pchar > nchar) {
        if (prelonger >= 0) {
          return 1;
        }

        else {
          return isSpace(next.charCodeAt(ni + 1));
        }
      }

      else if (pchar < nchar) {
        if (prelonger > 0) {
          return !isSpace(pre.charCodeAt(pi + 1));
        }

        else {
          return -1;
        }
      }
    }

    else if (pchar !== nchar) {
      return isSpace(pchar) ? -1 : 1;
    }
    
    pi++;
    ni++;
  }
};

module.exports = (list, opts = {}) => {
  if (Array.isArray(list)) {
    return list.sort(alphaSort.bind(opts));
  }
  throw new Error('args[0] must be Array');
}

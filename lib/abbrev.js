/**
 * var abbrev = require("./lib/abbrev");
 * abbrev("foo", "fool", "folding", "flop", 'f', 'rest', 'rest', 'rest', 'rests');
 * { 
      f: 'f',
      fl: 'flop',
      flo: 'flop',
      flop: 'flop',
      fol: 'folding',
      fold: 'folding',
      foldi: 'folding',
      foldin: 'folding',
      folding: 'folding',
      foo: 'foo',
      fool: 'fool',
      rest: 'rest',
      rests: 'rests' 
    }
  *
 */
module.exports = (...args) => {
  const argLen = args.length;
  const result = {};

  const getRest = (array, index) => {
    const child = array[index];
    const firstLetter = child.charAt(0);
    return array.filter((value, i) => value[0] === firstLetter && i !== index);
  };

  if (!argLen) return;
  if (argLen === 1) args = args[0];
  args = args.map(v => String(v)).filter((v, i, arr) => arr.lastIndexOf(v) === i);
  args.sort();

  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];
    let restArg = getRest(args, i);

    for (let j = 1, childLen = arg.length; j <= childLen; j += 1) {
      let letter = arg.substr(0, j);
      let pass = true;
      if (result[letter]) {
        continue;
      }

      for (let k = 0, restLen = restArg.length; k < restLen; k += 1) {
        if (restArg[k].substr(0, j) === letter
          && letter.length !== arg.length ) {
          pass = false;
          break;
        }
      }

      if (pass) {
        result[letter] = arg;
      }
    }
  }
  return result;
};

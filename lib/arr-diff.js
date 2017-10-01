const flatten = require('./array-flatten');

const diff = (base, other) => {
  const array = [];
  for (let i = 0, baseLen = base.length; i < baseLen; i += 1) {
    let passFlag = true;
    let value = base[i];
    if (other.indexOf(value) === -1) {
      array[array.length] = value;
    }
  }
  return array;
};

module.exports = (array, ...args) => {
  let index = -1;
  args = flatten(args);
  let argsLen = args.length;

  if (!argsLen) return array;
  while (++index < argsLen) {
    array = diff(array, args[index]);
  }
  return array;
};

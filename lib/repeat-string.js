
module.exports = (string, times = 1) => {
  if (typeof string !== 'string') {
    throw new Error('args[0] must be a string');
  }

  let res = '';
  let max = string.length * times;

  if (times === 1) return string;
  if (times === 2) return string + string;

  while (max > res.length && times > 1) {
    if (times & 1) {
      res += string;
    }

    times >>= 1;
    string += string;
  }
  res += string;
  res = res.substr(0, max);
  return res;
};

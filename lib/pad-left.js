
module.exports = (string, length, padder = ' ') => {
  string = String(string);
  padder = String(padder);
  const strLen = string.length;
  length = Number(length);
  length = !!length ? length : strLen;

  if (strLen >= length) {
    return string;
  }
  const array = new Array(length - strLen + 1);
  for (let i = 0, len = array.length - 1; i < len; i += 1) {
    array[i] = padder;
  }
  array[array.length - 1] = string;
  return array.join('');
};

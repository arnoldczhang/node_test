
module.exports = (string, length, padder = '0') => {
  string = String(string);
  padder = String(padder);
  const strLen = string.length;
  length = Number(length);
  length = !!length ? length : strLen;

  if (strLen >= length) {
    return string;
  }
  const array = new Array(length - strLen + 1);
  array[0] = string;
  for (let i = 1, len = array.length; i < len; i += 1) {
    array[i] = padder;
  }
  return array.join('');
};

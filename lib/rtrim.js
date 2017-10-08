
module.exports = (string = '', chars = ' ') => {
  let len;
  let i;
  if (string.toString) {
    string = string.toString();
    len = string.length;
    i = len - 1;
    chars = chars.split('');
    for (i; i > 0; i-- ) {
      if (chars.indexOf(string[i]) == -1) {
        return string.substring(0, i + 1);
      }
    }
  }

  else {
    throw new Error('type of args[0] is invalid');
  }
};

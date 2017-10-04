
module.exports = (string, spliter = '_') => {
  const reg = /([A-Z])/g;
  if (typeof string === 'string') {
    return string.replace(reg, (match, $1, index) => {
      return index ? `${spliter}${$1}` : $1;
    }).toLowerCase();
  }

  else {
    throw new Error('args[0] must be a string');
  }
};

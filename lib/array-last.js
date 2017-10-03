const slice = require('./slice');

module.exports = (array, length = 1) => {
  let len;
  if ('length' in array) {
    len = array.length;
    if (!len) {
      return null;
    }

    else {
      if (length === 1) {
        return array[len - 1];
      }
      return slice(array, len - length);
    }
  }
};

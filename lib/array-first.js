const slice = require('./slice');

module.exports = (array, length = 1) => {
  if ('length' in array) {
    if (!array.length) {
      return null;
    }

    else {
      if (length === 1) {
        return array[0];
      }
      return slice(array, 0, length);
    }
  }
};

module.exports = (array, val) => {
  if (array && 'length' in array) {
    for (let i = 0, length = array.length; i < length; i += 1) {
      if (val === array[i]) {
        return true;
      }
    }
  }
  return false;
};

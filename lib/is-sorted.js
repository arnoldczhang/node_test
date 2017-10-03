const defaultSortFn = (a, b) => a - b;

module.exports = (array, sortFn = defaultSortFn) => {
  if (Array.isArray(array)) {
    for (let i = 0, len = array.length; i < len - 1; i += 1) {
      if (sortFn(array[i], array[i + 1]) > 0) {
        return false;
      }
    }
    return true;
  }
};


module.exports = (array = [], index) => {
  if (index > array.length || index < 0) return;
  let last;
  let item;
  if (array.pop) {
    last = array.pop();
    if (index < array.length) {
      item = array[index];
      array[index] = last;
      return item;
    }
    return last;
  }

  else if (typeof array === 'string') {
    last = array.substr(-1);
    if (index < array.length - 1) {
      return array.substring(0, index) + last + array.substring(index + 1, array.length - 1);
    }
    return last;
  }
  return array;
};

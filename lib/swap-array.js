
module.exports = (array, startIndex, endIndex) => {
  let result;
  let swap;
  let length = array.length;
  
  if (arguments.length < 3
    || !Array.isArray(array)
    || startIndex === endIndex) {
    return array;
  }

  startIndex = Number(startIndex);
  endIndex = Number(endIndex);

  if (startIndex !== startIndex
    || endIndex !== endIndex) {
    return array;
  }

  startIndex = startIndex < 0 ? (length + startIndex) : startIndex;
  endIndex = endIndex < 0 ? (length + endIndex) : endIndex;
  result = array.map(v => v);
  swap = array[startIndex];
  result[startIndex] = array[endIndex];
  result[endIndex] = swap;
  return result;
};

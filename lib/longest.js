// Math.max.apply(this, array.map(child => child.length));
module.exports = (array) => {
  if (!array || !array.length) {
    return null;
  }

  let result = array[0];
  let max = result.length;
  for (let i = 1, len = array.length; i < len; i += 1) {
    let child = array[i].toString();
    let childLen = child.length;
    if (childLen > max) {
      max = childLen;
      result = child;
    }
  }
  return result;
};

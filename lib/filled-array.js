
module.exports = (filler, count) => {
  count = Number(count);
  if (count !== count) {
    count = 1;
  }
  let i = 0;
  const array = new Array(count);
  const isFn = typeof filler === 'function';

  if (!isFn && array.fill) {
    return array.fill(filler);
  }

  else {
    for ( ; i < count; i += 1) {
      array[i] = isFn ? filler(i) : filler;
    }
  }

  return array;
};

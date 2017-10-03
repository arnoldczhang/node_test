// console.log(range())
// console.log(range('a'))
// console.log(range(3))
// console.log(range(1, 4))
// console.log(range(NaN, NaN))

module.exports = (start, end) => {
  const result = [];

  if (typeof start !== 'number') {
    start = 0;
  }

  if (typeof end !== 'number') {
    if (end === undefined) {
      end = start;
      start = 0;
    } 

    else {
      end = 0;
    }
  }

  start = start | 0;
  end = end | 0;
  for ( ; start < end; start += 1) {
    result.push(start);
  }
  return result;
};

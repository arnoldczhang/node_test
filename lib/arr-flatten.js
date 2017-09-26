const flatten = (array, res = []) => {
  if ('length' in array) {
    for (let i = 0, len = array.length, value; i < len; i += 1) {
      value = array[i];
      if (Array.isArray(value)) {
        Array.prototype.push.apply(res, flatten(value));
      }

      else {
        res.push(array[i]);
      }
    }
  }
  return res;
};

const flatten2 = (array, res = []) => {
  if ('length' in array) {
    for (let i = 0, len = array.length, value; i < len; i += 1) {
      value = array[i];
      if (Array.isArray(value)) {
        flatten(value, res);
      }

      else {
        res.push(array[i]);
      }
    }
  }
  return res;
};

const flatten3 = (array, res = []) => {
  if ('length' in array) {
    for (let i = 0, len = array.length, value; i < len; i += 1) {
      value = array[i];
      if (Array.isArray(value)) {
        flatten(value, res);
      }

      else {
        res[res.length] = array[i];
      }
    }
  }
  return res;
};

module.exports = (array) => {
    return flatten3(array, []);
};

// console.time('f1');
// console.log(flatten(['a', ['b', ['c', 'd', ['e', ['f', 'g', ['h']]]]], 'd', ['e']], []));
// console.timeEnd('f1');
// console.time('f2');
// console.log(flatten2(['a', ['b', ['c', 'd', ['e', ['f', 'g', ['h']]]]], 'd', ['e']], []));
// console.timeEnd('f2');
// console.time('f3');
// console.log(flatten3(['a', ['b', ['c', 'd', ['e', ['f', 'g', ['h']]]]], 'd', ['e']], []));
// console.timeEnd('f3');
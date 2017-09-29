// var dedupe = require('./lib/dedupe')

// var aa = [{a: 2}, {a: 1}, {a: 1}, {a: 1}]
// var bb = dedupe(aa)
// console.log(bb)

// var aaa = [{a: 2, b: 1}, {a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]
// var bbb = dedupe(aaa, value => value.a)
// console.log(bbb)
const sigmund = require('./sigmund');

module.exports = (array, hashFn = sigmund) => {
  const result = [];
  const map = {};
  if (array.length) {
    for (let i = 0, len = array.length; i < len; i += 1) {
      let item = array[i];
      let hashKey = hashFn(item);
      if (map[hashKey]) {
        continue;
      }
      map[hashKey] = true;
      result.push(item);
    }
  }
  return result;
};
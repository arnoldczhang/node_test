const dotpather = require('./dotpather');

module.exports = (key = '', array = []) => {
  let result = [];
  if (Array.isArray(array)){
    resolve = dotpather(key);
    result = array.map(item => resolve(item));
  }
  return result;
};

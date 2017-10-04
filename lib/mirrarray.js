const cach = {};
const typeArr = ['string', 'number', 'undefined', 'boolean'];
const isValid = (key) => {
  return key === null
    || typeArr.indexOf(typeof key) != -1;
};

module.exports = (array) => {
  const cloneObj = {};
  if (Array.isArray(array)) {
    array.forEach((key, index) => {
      let type;
      if (isValid(key)) {
        type = typeof key;
        if (cach['' + key] && cach['' + key] !== type) {
          throw new Error('distinct elements');
        }

        else {
          cach['' + key] = type;
        }
        cloneObj[key] = key;
      }

      else {
        throw new Error(`the ${index} index of the input is not valid`);
      }
    });
    return cloneObj;
  }
  return array;
};

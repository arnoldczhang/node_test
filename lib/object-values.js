
module.exports = (object = {}) => {
  return Object.values
    ? Object.values(object)
    : Object.keys(object).map(key => object[key]);
};

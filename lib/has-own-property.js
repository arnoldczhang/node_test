const hasOwn = Object.prototype.hasOwnProperty;

module.exports = (object, prop) => {
  return hasOwn.call(object, prop);
};

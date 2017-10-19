
module.exports = (object) => {
  return object != null && (typeof object === 'object' || typeof object === 'function');
};

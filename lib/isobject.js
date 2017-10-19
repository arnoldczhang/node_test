
module.exports = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]';
};

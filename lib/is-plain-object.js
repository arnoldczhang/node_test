const isObject = require('isobject');

module.exports = (object) => {
  if (!isObject(object)) return false;
  const ctor = object.constructor;
  if (typeof ctor !== 'function') return false;
  const proto = ctor.prototype;
  if (!isObject(proto) || !proto.hasOwnProperty('isPrototypeOf')) return false;
  return true;
};

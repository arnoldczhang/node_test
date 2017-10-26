const isFunction = (func) => typeof func === 'function';

module.exports = (promise) => {
  return promise && (typeof promise === 'object' || isFunction(promise)) &&  isFunction(promise.then);
};

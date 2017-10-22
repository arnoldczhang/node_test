const curry = require('./curry-this');
const isFunction = (func) => typeof func === 'function';

module.exports = (...funcs) => {
  const argsLen = funcs.length;
  const _this = this;
  if (argsLen) {
    const innerFunc = curry(funcs.pop());
    return (...args) => {
      const cb = innerFunc.apply(this, args);
      if (isFunction(cb)) return cb;
      return funcs.reduceRight((func, pre) => {
        return pre(func);
      }, cb);
    };
  }
};

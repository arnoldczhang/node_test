/*
const curry = require('./lib/curry-this');

var plus = curry((a, b, c) => a + b + c);
log(plus(1, 2, 3));  //» 6
var plus = curry((a, b, c) => a + b + c);
log(plus(1)(2, 3));  //» 6
var plus = curry((a, b, c) => a + b + c);
log(plus(1, 2)(3));  //» 6
var plus = curry((a, b, c) => a + b + c);
log(plus(1)(2)(3));  //» 6
 */
const bind = Function.prototype.bind;

module.exports = (func) => {
  if (typeof func !== 'function') throw new Error('args[0] must be a function');
  let argsLen = func.length;
  const _this = this;
  const curry = (...args) => {
    argsLen -= args.length;
    func = bind.apply(func, [_this].concat(args));
    if (argsLen <= 0) return func();
    return curry;
  };
  return curry;
};

const extend = require('./extend-shallow');
const isString = (str) => typeof str === 'string';
const isRegExp = (reg) => reg instanceof RegExp;
const isFunction = (func) => typeof func === 'function';

const defaultOpts = {
  multiArgs: false,
  exclude: [/.+(Sync|Stream)$/],
  excludeMain: false,
  errorFirst: true,
};

module.exports = (func, opts = defaultOpts) => {
  opts = extend({}, defaultOpts, opts);
  return (...args) => {
    if (isFunction(func)) {
      return new Promise((resolve, reject) => {
        func.apply(null, args.concat((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }));
      });
    }
    return func;
  };
};

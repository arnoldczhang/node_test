/*
const deepBind = require('./lib/deep-bind')

var ctx = {
  app: {views: {}},
  context: {a: 'b'}
};

// pass the following to the template engine
var helpers = deepBind({
  foo: function() {
    return this.context;
  },
  bar: function() {},
  baz: function() {},
  aa: function() {return this.app; },
}, ctx, {
  bindFunc(key) {
    if (key === 'aa') {
      return {app: 'ip'};
    }
    return this;
  }
});

log(helpers.foo());
log(helpers.aa());
 */
const extend = require('./extend-shallow');
const isObject = (object) => object && typeof object === 'object';
const isFunction = (func) => typeof func === 'function';
const wrap = (cb, thisArg = {}) => {
  return (...args) => {
    return cb.apply(thisArg, args);
  };
};

const defaultOpts = {
  bindFunc: key => this,
};

const deepBind = (target, thisArg, options) => {
  Object.keys(target).forEach((key) => {
    const value = target[key];
    thisArg = options.bindFunc(key);

    if (isFunction(value)) {
      target[key] = wrap(value, thisArg);

      for (let key in value) {
        target[key] = value[key];
      }
    }

    if (isObject(value)) {
      deepBind(value, thisArg, options);
    }
  });
  return target;
};

const deepBindTrans = (target, thisArg = {}, options = defaultOpts) => {
  if (!isObject(target)) throw new Error('args[0] is expected be an object');
  options = extend({}, defaultOpts, options);
  options.bindFunc = options.bindFunc.bind(thisArg);
  return deepBind(target, thisArg, options);
};

module.exports = deepBindTrans;
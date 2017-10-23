const mimicFn = require('。、mimic-fn');
const extend = require('./extend-shallow');
const isPromise = (promise) => Object.prototype.toString.call(promise) === '[object Promise]';
const noop = val => val;
const cacheObj = new WeakMap();
const defaultOpts = {
  maxAge: Infinity,
  thisArg: null,
  cache: new Map(),
  cachePromiseRejection: false,
};

const getKey = (args) => {
  const len = argsLen = args.length;
  return len <= 1
    ? args[0]
    : args.toString();
};

const mem = (func = noop, opts = defaultOpts) => {
  opts = extend({}, defaultOpts, opts);
  const memorized = (...args) => {
    const memorizedCache = cacheObj.get(memorized);
    const key = getKey(args);
    let now = process.hrtime ? process.hrtime() : Date.now();
    let memValue = memorizedCache.get(key);

    if (Array.isArray(now)) {
      now = now[0] * 1e3 + now[1] / 1e6;
    }

    if (memorizedCache.has(key)) {
      if (now - memValue.time <= opts.maxAge) {
        return memValue.value;
      }
    }
    const result = func.apply(opts.thisArg, args);

    if (isPromise(result) && opts.cachePromiseRejection) {
      return result;
    }

    memorizedCache.set(key, {
      time: now,
      value: result,
    });
    return result;
  };

  mimicFn(memoized, func);
  cacheObj.set(memorized, opts.cache);
  return memorized;
};

mem.clear = func => {
  const cache = cacheObj.get(func);
  if (cache && typeof cache.clear === 'function') {
    cache.clear();
  }
};

module.exports = mem;
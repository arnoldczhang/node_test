const noop = (key, val) => [key, val];
const isGoodObject = (object) => {
  return typeof object === 'object'
    && (Array.isArray(object)
      || Object.prototype.toString.call(object) === '[object Object]')
    || typeof object === 'function';
};

const mapObj = (obj, func = noop, opts = {}, weakMap = new WeakMap()) => {
  if (!isGoodObject(obj)) {
    return obj;
  }

  opts = Object.assign({
    deep: false,
    target: {},
  }, opts);

  if (weakMap.has(obj)) {
    return weakMap.get(obj);
  }

  weakMap.set(obj, opts.target);
  const target = opts.target;
  delete opts.target;

  for (let key of Object.keys(obj)) {
    const newValue = func(key, obj[key], obj);
    let res = newValue[1];

    if (opts.deep && isGoodObject(res)) {
      if (Array.isArray(res)) {
        res = res.map(child => mapObj(child, func, opts, weakMap));
      }

      else {
        res = mapObj(res, func, opts, weakMap);
      }
    }
    target[newValue[0]] = res;
  }
  return target;
};

module.exports = mapObj;

const isObject = (object) => Object.prototype.toString.call(object) === '[object Object]';
const propIsEnumerable = Object.prototype.propertyIsEnumerable;
const isVoid0 = (object) => object == null;
const assign = (object, key, value) => {
  if (isVoid0(value)) return;
  if (object.hasOwnProperty(key) && isVoid0(object)) {
    throw new Error(`Cannot convert undefined or null to object (${key})`);
  }

  if (isObject(value)) {
    if (key in object) {
      if (!isObject(object[key])) object[key] = {};
    }

    else {
      object[key] = {};
    }
    deepAssign(object[key], value);

    if (Object.getOwnPropertySymbols) {
      const symbols = Object.getOwnPropertySymbols(value);
      for (let i = 0, symLen = symbols.length; i < symLen; i += 1) {
        let symbol = symbols[i];
        if (propIsEnumerable.call(value, symbol)) {
          assign(object, symbol, value[symbol]);
        }
      }
    }
  }

  else if (object[key] !== value) {
    object[key] = value;
  }
};

const deepAssign = (target, ...args) => {
  if (!isObject(target)) throw new Error('target must be an object');
  args.forEach((arg) => {
    if (target === arg) return;
    Object.keys(arg).forEach(key => assign(target, key, arg[key]));
  });
  return target;
};

module.exports = deepAssign;
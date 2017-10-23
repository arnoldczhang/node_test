
const once = (cb, strict = false) => {
  let preValue;
  return () => {
    if (cb.initial) {
      if (strict) {
        throw new Error('func can only be called once');
      }
      return preValue;
    }
    cb.initial = true;
    return preValue = cb();
  };
};

once.proto = once(() => {
  Object.defineProperty(Function.prototype, 'once', {
    value() {
      return once(this);
    },
    configurable: false,
    enumerable: false,
  });
  Object.defineProperty(Function.prototype, 'strict', {
    value() {
      return once(this, true);
    },
    configurable: false,
    enumerable: false,
  });
});

module.exports = once;
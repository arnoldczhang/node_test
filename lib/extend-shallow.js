const isExtendable = require('./is-extendable');

module.exports = (target, ...args) => {
  if (!isExtendable(target)) target = {};
  args.forEach((source) => {
    Object.keys(source).forEach((key) => {
      target[key] = source[key];
    });
  });
};

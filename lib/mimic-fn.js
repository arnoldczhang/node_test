
module.exports = (target, source) => {
  const propName = Object.getOwnPropertyNames(source);
  const symbolName = Object.getOwnPropertySymbols(source);
  for (const prop of propName.concat(symbolName)) {
    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source));
  }
};

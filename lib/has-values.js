
module.exports = (value, noZero) => {
  if (value == void 0) return false;
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'number') {
    if (!value && noZero) {
      return false;
    }
    return true;
  }

  if (typeof value.length !== 'undefined') return !!value.length;
  return !!Object.keys(value).length;

};

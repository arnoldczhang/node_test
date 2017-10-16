
module.exports = (string = '') => {
  const patherArr = string.split('.');
  return (object) => {
    if (typeof object === 'object') {
      for (let i = 0, len = patherArr.length; i < len; i += 1) {
        let key = patherArr[i];
        if (!key || object === void 0) return;
        object = object[key];
      }
      return object;
    }
  };
};

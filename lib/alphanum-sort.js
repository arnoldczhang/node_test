
const alphaSort = (pre, next) => {
  
};

module.exports = (...list) => {
  const argLen = list.length;
  if (argLen) {
    if (argLen === 1) {
      list = list[0];
    }

    list.sort(alphaSort);
  }

  else {
    throw new Error('args is needed');
  }
}

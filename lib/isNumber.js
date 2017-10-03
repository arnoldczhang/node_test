
module.exports = (num) => {
  const type = typeof num;
  if (type === 'number' || type === 'string') {
    num = +num;
    return num === num || !isFinite(num);
  }
  return false;
};

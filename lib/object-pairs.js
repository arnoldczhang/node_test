
module.exports = (object = {}) => {
  const keyArr = Object.keys(object);
  const keyLen = keyArr.length;
  const result = new Array(keyLen);
  for(let i = 0; i < keyLen; i += 1) {
    let key = keyArr[i];
    result[i] = [key, object[key]];
  }
  return result;
};

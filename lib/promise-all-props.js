
module.exports = (object) => {
  const keyArr = Object.keys(object);
  const valueArr = keyArr.map(key => object[key]);
  return Promise.all(valueArr).then((result) => {
    return result.reduce((res, val, index) => {
      res[keyArr[index]] = val;
      return res;
    }, {});
  });
};

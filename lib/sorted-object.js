
module.exports = (object) => {
  const result = {};
  return Object.keys(object).sort().forEach(key => result[key] = object[key]);
  return result;
};

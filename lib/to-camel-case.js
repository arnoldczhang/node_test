/*
log(camel('adas_ddd_ww')) => adasDddWw
 */
module.exports = (string) => {
  return string.replace(/[\W_]+([a-z])/g, (match, $1, index) => {
    return index ? $1.toUpperCase() : match;
  });
};

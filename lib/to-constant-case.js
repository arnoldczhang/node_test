
module.exports = (string) => {
  return string.toUpperCase().replace(/[\W]+([A-Z])/g, (match, $1, index) => {
    return (index ? '_' : '') + $1;
  });
};

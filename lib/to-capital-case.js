
module.exports = (string) => {
  return string.replace(/(?:^|[\W_]+)([a-z])/g, (match, $1, index) => {
    return (index ? ' ' : '') + $1.toUpperCase();
  });
};

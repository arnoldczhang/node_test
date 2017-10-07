const align = require('./align-text');

module.exports = (words, width) => {
  return align(words, (len, longest, line, lines) => {
    longest = longest > width ? longest : width;
    return Math.floor((longest - len) / 2);
  });
};

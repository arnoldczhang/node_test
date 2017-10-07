const repeat = require('./repeat-string');

module.exports = (words = '', max = words.length) => {
  let newWords = words;
  let len = words.length;

  if (max > len) {
    newWords += repeat(' ', max - len);
  }
  return newWords;
};

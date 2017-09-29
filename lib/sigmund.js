// console.log(sigmund(null));
// console.log(sigmund(undefined));
// console.log(sigmund({}));
// console.log(sigmund(a));

module.exports = (object, maxSession = 10) => {
  let result = '';
  const note = [];

  const sigmundFn = (subject, session) => {
    if (session >= maxSession) return;
    if (typeof subject === 'function') {
      return;
    }

    // typeof null === 'object'
    // typeof undefined === 'undefined'
    // typeof /aaa/ === 'object'
    if (typeof subject !== 'object'
      || subject && subject.__proto__ === RegExp.prototype
      || subject == null) {
      result += subject;
      return;
    }

    result += '{';

    if (note.indexOf(subject) != -1) {
      return;
    }

    note.push(subject);
    Object.keys(subject).forEach((key) => {
      result += key;
      sigmundFn(subject[key], session);
      session += 1;
    });
    result += '}';
  };
  return sigmundFn(object, 0), result;
};
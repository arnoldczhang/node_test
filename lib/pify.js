/*

// const pify = require('./lib/pify');

// pify(fs.readFile)('typings.json', 'utf8').then((res) => {
//   log(res);
// });




// pify(fs.readFile)('typingsaaa.json', 'utf8').catch((err) => {
//   log(err);
// });




// pify(fs, {
//   include: ['readFile'],
// }).readFile('typings.json', 'utf8').then((res) => {
//   log(res);
// });




// pify(fs, {
//   multiArgs: true,
// }).readFile('typings.json', 'utf8').then((res) => {
//   log(res);
// });





// pify(fs, {
//   include: ['readFile'],
// }).readFile('typingsaaa.json', 'utf8').catch((err) => {
//   log(err);
// });




// function main () {};

// main.read = (word, cb) => {
//   setTimeout(() => {
//     cb(null, word);
//   }, 1000);
// };

// pify(main, {
//   excludeMain: true,
// }).read('hello world').then((res) => {
//   log(res);
// });
 */
const extend = require('./extend-shallow');
const isObject = (object) => object && typeof object === 'object';
const isString = (str) => typeof str === 'string';
const isRegExp = (reg) => reg instanceof RegExp;
const isFunction = (func) => typeof func === 'function';

const defaultOpts = {
  multiArgs: false,
  exclude: [/.+(Sync|Stream)$/],
  excludeMain: false,
  errorFirst: true,
};

const someArray = (array, string) => {
  if (!array || !array.length) {
    return true;
  }
  return array.some(key => isRegExp(key) ? key.test(string) : isString(key) ? key === string : false);
};

const promiseFunc = (resolve, reject, opts = defaultOpts) => {
  return (...args) => {
    let error;
    let data;

    // ==>errorFirst: args[0] means `error`
    if (opts.errorFirst) {
      error = args.shift();
      if (error) return reject(error);
    }
    data = args[0];
    // ==>multiArgs: return all the args exclude `error`
    opts.multiArgs ? resolve(args) : resolve(data);
  };
};

module.exports = (input, opts = defaultOpts) => {
  opts = extend({}, defaultOpts, opts);
  const _Promise = isFunction(opts.promiseModule) ? opts.promiseModule : Promise;
  // ==>excludeMain: if is true, only promisify the methods of the input
  if (!opts.excludeMain && isFunction(input)) {
    return (...args) => {
      return new _Promise((resolve, reject) => {
        input.apply(null, args.concat(promiseFunc(resolve, reject, opts)));
      });
    };  
  }

  Object.keys(input).forEach((key) => {
    const func = input[key];

    if (isFunction(func)) {
      let includeResult = someArray(opts.include, key);
      let excludeResult = someArray(opts.exclude, key);

      if (includeResult && !excludeResult) {
        input[key] = (...args) => {
          return new _Promise((res, rej) => {
            func.apply(null, args.concat(promiseFunc(res, rej, opts)));
          });
        };
      }
    }
  });
  return input;
};

/*
const pEvent = require('./lib/p-event');

async function getOpenReadStream(file) {
  const stream = fs.createReadStream(file);
  await pEvent(stream, 'open');
  return stream;
}

getOpenReadStream('typings.json')
  .then((stream) => {
    stream.pipe(process.stdout);
  })
  .catch(console.error);
 */
const extend = require('./extend-shallow');
const isFunction = (func) => typeof func === 'function';
const defaultOpts = {
  rejectionEvents: ['error'],
  multiArgs: false,
  timeout: Infinity,
};


module.exports = (emitter, event, opts = defaultOpts) => {
  let filter;
  if (isFunction(opts)) {
    filter = opts;
    opts = defaultOpts;
  }

  opts = extend({}, defaultOpts, opts);
  const on = emitter.addEventListener || emitter.on || emitter.addListener;
  const off = emitter.removeEventListener || emitter.off || emitter.removeListener;

  if (!isFunction(on) || !isFunction(on)) {
    throw new Error('emitter hasn`t the binding event');
  }

  return new Promise((resolve, reject) => {
    on.call(emitter, event, (...args) => {
      // console.log(args)
      let data = args[0];
      // => filter
      if (isFunction(filter) && !filter(data)) return;
      // => multiArgs
      if (opts.multiArgs) return resolve(args);
      resolve(data);
    });
    // => rejectionEvents
    if (Array.isArray(opts.rejectionEvents)) {
        opts.rejectionEvents.forEach((event) => {
          off.call(emitter, event, (...args) => {
            if (opts.multiArgs) return reject(args);
            reject(args[0]);
          });
        });
    }
  });
};

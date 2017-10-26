/*
const sleep = require('./lib/sleep-promise');

(async () => {
    await sleep(2000); // await默认触发then
    console.log('2 seconds later …');
})();


sleep(2000).then(function() {
    console.log('2 seconds later …')
});

let trace = value => {
    console.log(value);
    return value;
};

sleep(2000)
  .then(() => "hello")
  .then(trace)
  .then(sleep(1000))
  .then(value => value + " world")
  .then(trace)
  .then(sleep(500))
  .then(value => value + "!")
  .then(trace);

// [2 seconds sleep]
// hello
// [1 second sleep]
// hello world
// [500 ms sleep]
// hello world!
 */
const newPromise = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

module.exports = (timeout) => {
  const sleep = (res) => {
    return newPromise(timeout).then(() => res);
  };

  sleep.then = (cb) => {
    const sleepPromise = newPromise(timeout);
    return sleepPromise.then.apply(sleepPromise, [cb]);
  };

  sleep.catch = Promise.resolve().catch;
  return sleep;
};

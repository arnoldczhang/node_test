const co = (gen) => {
  if (typeof gen !== 'function') return;
  const generator = gen();
  if (generator == null) return;

  const next = (nextValue = '') => {
      nextValue = generator.next(nextValue);

      if (nextValue.done) {
        return nextValue.value;
      }

      nextValue = nextValue.value;
      if (nextValue.then) {
        return nextValue.then((res) => {
          next(res);
        });
      }

      else if (Array.isArray(nextValue)) {
        return Promise.all(nextValue).then((res) => {
          next(res);
        });
      }

      else if (typeof nextValue === 'object') {
        const results = [];
        const keyArr = Object.keys(nextValue);
        keyArr.forEach((key) => {
          const value = nextValue[key];
          results.push(value.then ? value.then((res) => {
              nextValue[key] = res;
          }) : value);
        });
        return Promise.all(results).then(() => {
          next(nextValue);
        });
      }
  };

  return new Promise((res, rej) => {
    try {
      return res(next());
    } catch (err) {
      rej(err);
    }
  });
};
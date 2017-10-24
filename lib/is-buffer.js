
const isBuffer = (buff) => {
  return buff.constructor
    && typeof buff.constructor.isBuffer === 'function'
    && buff.constructor.isBuffer(buff);
};

module.exports = (buff) => {
  return buff != null && isBuffer(buff) && !!buff._isBuffer;
};

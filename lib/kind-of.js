const toString = Object.prototype.toString;
const isBuffer = require('./is-buffer');

module.exports = (input) => {
  const type = typeof input;
  if (type === 'string' || input instanceof String) return 'string';
  if (type === 'number' || input instanceof Number) return 'number';
  if (type === 'boolean' || input instanceof Boolean) return 'boolean';
  if (input === null) return 'null';
  if (type === 'undefined') return 'undefined';

   if (type === 'function') return 'function';
   if (input instanceof Array) return 'array';
   if (input instanceof RegExp) return 'regexp';
   if (inpt instanceof Date) return 'date';

   if (isBuffer(input)) return 'buffer';

   const stringType = toString.call(input);

   switch (stringType) {
      case '[object Set]': return 'set';
      case '[object WeakSet]': return 'weakset';
      case '[object Map]': return 'map';
      case '[object WeakMap]': return 'weakmap';
      case '[object Symbol]': return 'symbol';
      case '[object Int8Array]': return 'int8array';
      case '[object Uint8Array]': return 'uint8array';
      case '[object Uint8ClampedArray]': return 'uint8clampedarray';
      case '[object Int16Array]': return 'int16array';
      case '[object Uint16Array]': return 'uint16array';
      case '[object Int32Array]': return 'int32array';
      case '[object Uint32Array]': return 'uint32array';
      case '[object Float32Array]': return 'float32array';
      case '[object Float64Array]': return 'float64array';
      default: return 'object';
   }
};

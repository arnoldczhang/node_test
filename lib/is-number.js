/*
var isNumber = require('is-number');

log(isNumber(5e3)     ) //=> 'true'
log(isNumber(0xff)    ) //=> 'true'
log(isNumber(-1.1)    ) //=> 'true'
log(isNumber(0)       ) //=> 'true'
log(isNumber(1)       ) //=> 'true'
log(isNumber(1.1)     ) //=> 'true'
log(isNumber(10)      ) //=> 'true'
log(isNumber(10.10)   ) //=> 'true'
log(isNumber(100)     ) //=> 'true'
log(isNumber('-1.1')  ) //=> 'true'
log(isNumber('0')     ) //=> 'true'
log(isNumber('012')   ) //=> 'true'
log(isNumber('0xff')  ) //=> 'true'
log(isNumber('1')     ) //=> 'true'
log(isNumber('1.1')   ) //=> 'true'
log(isNumber('10')    ) //=> 'true'
log(isNumber('10.10') ) //=> 'true'
log(isNumber('100')   ) //=> 'true'
log(isNumber('5e3')   ) //=> 'true'
log(isNumber(parseInt('012'))  ) //=> 'true'
log(isNumber(parseFloat('012'))) //=> 'true'
log(isNumber('foo')             )//=> 'false'
log(isNumber([1])               )//=> 'false'
log(isNumber([])                )//=> 'false'
log(isNumber(function () {})    )//=> 'false'
log(isNumber(Infinity)          )//=> 'false'
log(isNumber(NaN)               )//=> 'false'
log(isNumber(new Array('abc'))  )//=> 'false'
log(isNumber(new Array(2))      )//=> 'false'
log(isNumber(new Buffer('abc')) )//=> 'false'
log(isNumber(null)              )//=> 'false'
log(isNumber(undefined)         )//=> 'false'
log(isNumber({abc: 'abc'})      )//=> 'false'

 */
const kindOf = require('kind-of');

module.exports = (input) => {
  const type = kindOf(input);
  if (type === 'number' || type === 'string') {
    const iInput = Number(input);
    return iInput - iInput + 1 >= 0 && input !== '';
  }
  return false;
};

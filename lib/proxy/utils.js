// proxy utils
const changeCase = require('change-case');

module.exports = {
  lower(obj) {
    for(let key in obj){
        let val = obj[key];
        delete obj[key];

        obj[key.toLowerCase()] = val;
    }
    return obj;
  },

  upper(obj) {
    const upperObject = {};
    for(let key in obj) {
        let upperKey = changeCase.headerCase(key);
        upperObject[upperKey] = obj[key];
    }
    return upperObject;
  },

};
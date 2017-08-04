const ENV = 'dev'// 'prod';
const configMap = ['dev', 'prod'];
module.exports = configMap.indexOf(ENV) > -1 
  ? require("./webpack.config." + ENV)() 
  : require("./webpack.config.dev")();



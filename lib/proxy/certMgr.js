const EasyCert = require('node-easy-cert');

const HOME = process.env.HOME || process.env.USERPROFILE;
const options = {
    rootDirPath: HOME + '/.xxproxy_certs',
    defaultCertAttrs: [
        { name: 'countryName', value: 'CN' },
        { name: 'organizationName', value: 'xxProxy' },
        { shortName: 'ST', value: 'SH' },
        { shortName: 'OU', value: 'xxProxy SSL Proxy' }
    ]
};

const easyCert = new EasyCert(options);
const crtMgr = Object.assign({}, easyCert);

crtMgr.getRoot = () => {
  return options.rootDirPath;
};
module.exports = crtMgr;
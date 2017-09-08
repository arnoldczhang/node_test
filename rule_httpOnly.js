//rule scheme :

module.exports = {
  replaceRequestData(req, data) {
    const url = req.url;
    if (/ajax\/\w+\/addr\w+/.test(url)) {
      console.log('dper=========>' + url, /userId/i.test(data.toString()));
    }

    if (/orderList|Submit/i.test(url)) {
      console.log('dper=========>' + url, /[^_]token/.test(data.toString()));
    }
    return data;
  },

  replaceServerResDataAsync(req, res, serverResData, cb) {
    const url = req.url;
    const string = serverResData.toString();
    if (/checkLogin/i.test(url)) {
      console.log('login===========>' + url, string);
    }

    if (/waimai\/(?:mindex|wxwallet|weixin|qq\w+?)/.test(url)) {
      const match = string.match(/module\s*:'(\w+)'/);
      if (match) {
        console.log('module=========>', match[1]);
      }
    }
    cb(serverResData);
  },

  replaceResponseHeader(req,res,header){
      header = header || {};
      const host = req.headers.host;
      if (/takeaway\.51ping\.com/.test(host)) {
        const dper = (req.headers.cookie.match(/dper=([^;]+)/) || [])[1];
        if (dper) {
          header["Set-Cookie"] = `dper=${dper}; Path=/; domain=.51ping.com; HttpOnly`;
        }
      }
      return header;
  }
};
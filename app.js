const express = require('express');
const utility = require('utility');
const http = require('http');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const httpProxy = require('http-proxy');
const superagent = require('superagent');
const EasyCert = require('node-easy-cert');
const cheerio = require('cheerio');
const co = require('co');
const koa = require('koa');
const url= require("url");
const fs = require('fs');
const tls = require('tls');

// const proxy = httpProxy.createProxyServer({
//   target: {
//     host: '127.0.0.1',
//     port: 8080
//   }
// });

// proxy.on('error', function (err, req, res) {  
//   res.writeHead(500, {  
//     'Content-Type': 'text/plain'  
//   });  
//   res.end('Something went wrong. And we are reporting a custom error message.');  
// });

const options = {
  // rootDirPath: util.getUserHome() + '/.anyproxy_certs',
  defaultCertAttrs: [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'test_proxy' },
    { shortName: 'ST', value: 'SH' },
    { shortName: 'OU', value: 'test_proxy SSL Proxy' }
  ]
};

const createServer = (key, cert) => {
  const server = https.createServer({
    key: fs.readFileSync(key) || fs.readFileSync('key.pem'),
    cert: fs.readFileSync(cert) || fs.readFileSync('certificate.pem'),
  }, (req, res) => {
    console.log('Proxying https request at %s', new Date());
    res.writeHead(200);
    res.end('hello world\n');
  });

  server.listen(8000, () => {
    console.log('server bound');
  });
};

const easyCert = new EasyCert(options);
const rootOptions = {
  commonName: 'test_proxy',
  overwrite: true,
};

easyCert.generateRootCA(rootOptions, (err, key, cert) => {
  if (!err) {
    console.log(key, cert);
    createServer(key, cert);
  }
});

// else {
//   easyCert.getCertificate('127.0.0.1', (err, key, cert) => {
//     if (!err) {
//       createServer(key, cert);
//     }

//     else {
//       console.log(err);
//     }
//   });
// }


// https.createServer(options.https, function(req, res) {
//   console.log('Proxying https request at %s', new Date());
//   proxy.proxyRequest(req, res);
// }).listen(8888, function(err) {
//   if (err)
//     console.log('Error serving https proxy request: %s', req);

//   console.log('Created https proxy. Forwarding requests from %s to %s:%s', '443');
// });







// const server = http.createServer(function(req, res) {
//   const host = req.headers.host;
//   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
//   switch(host){
//     case 'takeaway.51ping.com':
//       proxy.web(req, res, { target: `${host}:80` });
//     default:
//       res.writeHead(200, {
//           'Content-Type': 'text/plain'
//       });
//       res.end('Welcome to my server!');
//   }
//   console.log('host=====>' + host);
//   console.log('ip=====>' + ip);
// });

// server.listen(8888, () => {
//   console.log('8888 start');
// });














// const app = new koa();

// app.use(async (ctx, next) => {
//   const start = Date.now();
//   ctx.body = 'a a a';
//   await next();
//   const ms = Date.now() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// }).use((ctx, next) => {
//   console.log(ctx.response.body === ctx.body);
// }).listen(3000, () => {
//   console.log('koa app start at port 3000');
// });




// // listen
// const server = http.createServer(/*function callback*/(req, res) => {

// });

// server.listen(3000, () => {

// });

// // use
// this.middleware.push(fn);




// http.createServer(function(req,res){
//     res.writeHead(200,{
//         "content-type":"text/plain"
//     });
//     res.write("hello nodejs");
//     res.end();
// }).listen(3001, () => {
//   console.log('start');
// });



// app.get('/', function (req, res) {
//   superagent.get('https://cnodejs.org/')
//     .end(function (err, sres) {
//       // 常规的错误处理
//       if (err) {
//         return next(err);
//       }
//       // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
//       // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
//       // 剩下就都是 jquery 的内容了
//       var $ = cheerio.load(sres.text);
//       var items = [];
//       $('#topic_list .topic_title').each(function (idx, element) {
//         var $element = $(element);
//         items.push({
//           title: $element.attr('title'),
//           href: $element.attr('href')
//         });
//       });

//       res.send(items);
//     });
// });

// app.listen(3000, function (req, res) {
//   console.log('app is running at port 3000');
// });
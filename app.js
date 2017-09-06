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
const async = require('async');
const changeCase = require('change-case');
const zlib = require('zlib');
const Buffer = require('buffer').Buffer;
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

// const options = {
//   // rootDirPath: util.getUserHome() + '/.anyproxy_certs',
//   defaultCertAttrs: [
//     { name: 'countryName', value: 'CN' },
//     { name: 'organizationName', value: 'test_proxy' },
//     { shortName: 'ST', value: 'SH' },
//     { shortName: 'OU', value: 'test_proxy SSL Proxy' }
//   ]
// };

// const createServer = (key, cert) => {
//   const server = https.createServer({
//     key: fs.readFileSync(key) || fs.readFileSync('key.pem'),
//     cert: fs.readFileSync(cert) || fs.readFileSync('certificate.pem'),
//   }, (req, res) => {
//     console.log('Proxying https request at %s', new Date());
//     res.writeHead(200);
//     res.end('hello world\n');
//   });

//   server.listen(8000, () => {
//     console.log('server bound');
//   });
// };

// const easyCert = new EasyCert(options);
// const rootOptions = {
//   commonName: 'test_proxy',
//   overwrite: true,
// };

// easyCert.generateRootCA(rootOptions, (err, key, cert) => {
//   if (!err) {
//     console.log(key, cert);
//     createServer(key, cert);
//   }
// });

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





// const proxy = httpProxy.createProxyServer({});
// const server = http.createServer(function(req, res) {
//   const host = req.headers.host;
//   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
//   switch(host){
//     case 'takeaway.51ping.com':
//       proxy.web(req, res, { target: `${host}:80` });
//       break;
//     default:
//       res.writeHead(200, {
//           'Content-Type': 'text/plain'
//       });
//       res.end('Welcome to my server!');
//   }
//   console.log('host=====>' + host);
//   console.log('ip=====>' + ip);
// });

// server.listen(8001, () => {
//   console.log('8001 start');
// });

// const proxy = httpProxy.createProxyServer({
//   target:'http://localhost:8002'
// }).listen(8001);

var lower_keys = function(obj){
    for(var key in obj){
        var val = obj[key];
        delete obj[key];

        obj[key.toLowerCase()] = val;
    }

    return obj;
};

var upper_keys = function (obj) {
    var upperObject = {};
    for(var key in obj) {
        var upperKey = changeCase.headerCase(key);
        upperObject[upperKey] = obj[key];
    }

    return upperObject;
};

http.createServer((req, userRes) => {
  var host               = req.headers.host,
        protocol           = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http",
        fullUrl            = protocol === "http" ? req.url : (protocol + '://' + host + req.url),
        urlPattern         = url.parse(fullUrl),
        path               = urlPattern.path,
        resourceInfo,
        resourceInfoId     = -1,
        reqData;

    // console.log(req.url);
    // console.log(path);

    //record
    resourceInfo = {
        host      : host,
        method    : req.method,
        path      : path,
        protocol  : protocol,
        url       : protocol + "://" + host + path,
        req       : req,
        startTime : new Date().getTime()
    };

    console.log("\nreceived request to : " + host + path);

    //get request body and route to local or remote
    async.series([
        fetchReqData,
        routeReq
    ],function(){

    });

    //get request body
    function fetchReqData(callback){
        var postData = [];
        req.on("data",function(chunk){
            postData.push(chunk);
        });
        req.on("end",function(){
            reqData = Buffer.concat(postData);
            resourceInfo.reqBody = reqData.toString();
            callback();
        });
    }

    //route to dealing function
    function routeReq(callback){
        console.log("==>will forward to real server by proxy");
        dealWithRemoteResonse(callback);
    }

    function dealWithRemoteResonse(callback){
        var options;

        //modify request options
        options = {
            hostname : urlPattern.hostname || req.headers.host,
            port     : urlPattern.port || req.port || (/https/.test(protocol) ? 443 : 80),
            path     : path,
            method   : req.method,
            headers  : req.headers
        };

        options.rejectUnauthorized = false;
        try{
            delete options.headers['accept-encoding']; //avoid gzipped response
        }catch(e){}

        //update request data
        options.headers = lower_keys(options.headers);
        options.headers["content-length"] = reqData.length; //rewrite content length info

        options.headers = upper_keys(options.headers);

        //send request
        var proxyReq = ( /https/.test(protocol) ? https : http).request(options, function(res) {

            //deal response header
            var statusCode = res.statusCode;

            var resHeader = res.headers;
            resHeader = lower_keys(resHeader);

            // remove gzip related header, and ungzip the content
            // note there are other compression types like deflate
            var ifServerGzipped =  /gzip/i.test(resHeader['content-encoding']);
            if(ifServerGzipped){
                delete resHeader['content-encoding'];
            }
            delete resHeader['content-length'];

            userRes.writeHead(statusCode, resHeader);

            //deal response data
            var length,
                resData = [];

            res.on("data",function(chunk){
                resData.push(chunk);
            });

            res.on("end",function(){
                var serverResData;

                async.series([

                    //ungzip server res
                    function(callback){
                        serverResData     = Buffer.concat(resData);
                        if(ifServerGzipped ){
                            zlib.gunzip(serverResData,function(err,buff){
                                serverResData = buff;
                                callback();
                            });
                        }else{
                            callback();
                        }

                    //get custom response
                    },function(callback){
                      userRes.end(serverResData);
                      callback();
                    //udpate record info
                    },function(callback){
                        resourceInfo.endTime    = new Date().getTime();
                        resourceInfo.statusCode = statusCode;
                        resourceInfo.resHeader  = resHeader;
                        resourceInfo.resBody    = serverResData;
                        resourceInfo.length     = serverResData ? serverResData.length : 0;
                        callback();
                    }
                ],function(err,result){
                    callback && callback();
                });

            });
            res.on('error',function(error){
                console.log('error' + error);
            });

        });

        proxyReq.on("error",function(e){
            console.log("err with request :" + e + "  " + req.url);
            userRes.end();
        });

        proxyReq.end(reqData);
    }
}).listen(8001, () => {
  console.log('8001 started');
});

// function onRequest(req, res) {
//   // console.log('serve: ' + req.url);
//   const host = req.headers.host;
//   console.log(host);
//   res.setHeader('Access-Control-Allow-Origin', "*");
//   var options = {
//     hostname: host,
//     port: 80,
//     path: req.url,
//     method: 'GET'
//   };

//   // var proxy = http.request(options, function (res) {
//   //   res.pipe(res, {
//   //     end: true
//   //   });
//   // });

//   // req.pipe(proxy, {
//   //   end: true
//   // });
// }














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
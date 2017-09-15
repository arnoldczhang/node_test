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
const net = require('net');
const qs = require('querystring');

const {
  log,
} = require('./lib/proxy/utils');

const data = {
  initialLat: 31.215287,
  initialLng: 121.420339,
  actualLat: 0,
  actualLng: 0,
  lat: 31.215287,
  lng: 121.420339,
  geoType: 1,
  _: 1505207587128,
};

const server = http.createServer((req, res) => {
  const reqData = [];
  const headers = req.headers;
  req.on('data', (chunk) => {
    reqData.push(chunk);
  });

  req.on('end', () => {
    log('end', headers);
  });

  if (headers['if-range'] === '1234') {
    res.writeHead(200, {
      ETag: 'asdf21f1e',
      'Cache-Control': 'no-cach',
      'server': 'Tengin',
    });
  }

  else {
    res.writeHead(500, {
      'Retry-After': new Date,
      // 'location': 'http://www.baidu.com',
      'server': 'Tengin',
      'Content-Type': 'text/html',
      'Content-Location': 'www.baidu.com',
      'Content-MD5': 'ND902N3O2O320KWEN',
      'Set-Cookie': 'status=true; HttpOnly',
    });    
  }

  res.end('aaaaa');
}).listen(8001, () => {
  console.log('8001 started');
  createRequest();
});

const createRequest = () => {
  const req = https.request({
    hostname: 'activity.dianping.com',
    // hostname: 'p1.meituan.net',
    port: 443,
    path: `/waimai/ajax/newm/mypoicouponlist?status=0&pageIndex=0&lat=0&lng=0&initialLng=121.420341&initialLat=31.21529&actualLat=0&actualLng=0&_token=eJxtjlFvgjAUhf9LH%2FZEgBYKSkIMinNssGQTzNyymIoKHVIYVCsu%2B%2B%2BrmZtZsuQm37nn3uScD9AEK%2BBAXdeRoQDeSo11bGILQbsHsQLSv17fthWwbGY%2BcF4MpCvY6r2ejEe5X4yLQqac00cgH0DOed06mkZSTveUd%2BqKElZTlqlpVWqC0JJQjbyRg8bWotTqiqbVrq7Yhm8HlFFOyTYk3DWgiiBG%2Fasfj2UuRFA1kW6YECi%2FOZwUayLI%2FzmniMGmqUq3XDCyX%2BDF9wHIumUs60oWZ5Iz%2BZktzRhwwPr2EE8LsbtLjKiXFG0bzx4yOzzq1U17DI9RUXRBHk5yVk%2Fy9%2Bfx9snrKnHvB0mkjbvInx%2BuPT60hDG0uibwx30YR%2FvbZTLqRuZuOhV1uJzDxAs8kngbU7gu%2BPwCI7GHUw%3D%3D&_=1505456217985`,
    method: 'GET',
    key: fs.readFileSync('./rootCA.key'),
    cert: fs.readFileSync('./rootCA.crt'),
    headers: {
      cookie: 'dper=2f52f2c61fda3d4483654f4f2b1559a0ebf19983f22164b38aa3917b5a32d47f',
    },
  }, res => {
    log(res.headers)
    // res.setEncoding("binary");
    const headers = res.headers;
    const queue = [];

    res.on('data', (chunk) => {
      queue.push(chunk);
    });

    res.on('end', () => {
      log(res.statusCode, res.headers, queue.toString())
      // fs.writeFile('./aa.jpg', queue, {
      //   encoding: 'binary',
      // }, (err) => {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   console.log('done');
      // });
    });
  });

  req.on('connect', (req, socket, head) => {
    console.log('req===>', req);
  });

  req.on('error', (err) => {
    console.log('error===>', err);
  });

  req.end();
};
// var client = net.createConnection(8088, '127.0.0.1', () => {

// });
 
// client.on('connect', function(){
//     console.log('客户端：已经与服务端建立连接');
// });
 
// client.on('data', function(data){
//     console.log('客户端：收到服务端数据，内容为{'+ data +'}');
// });
 
// client.on('close', function(data){
//     console.log('客户端：连接断开');
// });
 
// client.end('你好，我是客户端');


//只要socket连接被成功创建就会调用这里的connect事件  
// const client = net.connect({port:8088}, () => {
//   console.log('客户端被连接');  
//   client.write('客户端数据');  
//   client.end('aaa');
// });  

// //客户端data事件  
// client.on('data', (data) => {
//   console.log(data.toString());  
// });  

// client.on('end', () => {
//   console.log('客户端断开');  
// }); 

// client.on('close', () => {
//   console.log('closed');
// });




// const lower = (obj) => {
//   for(var key in obj){
//       var val = obj[key];
//       delete obj[key];

//       obj[key.toLowerCase()] = val;
//   }
//   return obj;
// };

// const upper = (obj) => {
//   var upperObject = {};
//   for(var key in obj) {
//       var upperKey = changeCase.headerCase(key);
//       upperObject[upperKey] = obj[key];
//   }
//   return upperObject;
// };

// const replaceReqData = (req, data) => {
//   // 请求数据处理
//   return data;
// };

// const replaceResData = (req, res, data) => {
//   // 返回数据处理
//   return data;
// };

// const replaceResHeader = (req, res, header) => {
//   // 返回头
//   const host = header.host;
//   const cookie = header.cookie;
//   if (/\.51ping\.com/.test(host)) {
//     if (cookie) {
//       const dper = (cookie.match(/dper=([^;]+)/) || [])[1];
//       if (dper) {
//         console.log('dper=============>', dper);
//         header["Set-Cookie"] = `dper=${dper}; Path=/; domain=.51ping.com; HttpOnly`;
//       }
//     }
//   }
//   return header;
// };

// http.createServer((req, userRes) => {
//   let host = req.headers.host;
//   let protocol = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http";
//   let fullUrl = protocol === "http" ? req.url : (protocol + '://' + host + req.url);
//   let urlPattern = url.parse(fullUrl);
//   let path = urlPattern.path;
//   let resourceInfo;
//   let resourceInfoId = -1;
//   let reqData;

//   resourceInfo = {
//     protocol,
//     host,
//     path,
//     req,
//     method: req.method,
//     url: protocol + "://" + host + path,
//     startTime: new Date().getTime(),
//   };

//   const bindReqResolver = (callback) => {
//     const postData = [];
//     req.on("data", (chunk) => {
//       postData.push(chunk);
//     });
//     req.on("end", () => {
//       reqData = Buffer.concat(postData);
//       reqData = replaceReqData(req, reqData);
//       resourceInfo.reqBody = reqData.toString();
//       callback();
//     });
//   };

//   const bindResResolver = (callback) => {
//     const isSecure = /https/.test(protocol);
//     const options = {
//       hostname: urlPattern.hostname || host,
//       port: urlPattern.port || req.port || (isSecure ? 443 : 80),
//       path,
//       method: req.method,
//       headers: req.headers,
//       rejectUnauthorized: false,
//     };

//     try{
//       delete options.headers['accept-encoding']; //avoid gzipped response
//     }catch(e){

//     }

//     options.headers = lower(options.headers);
//     options.headers["content-length"] = reqData.length; //rewrite content length info
//     options.headers = upper(options.headers);

//     const proxyReq = (isSecure ? https : http).request(options, function(res) {
//       const statusCode = res.statusCode;
//       const resHeader = res.headers;
//       replaceResHeader(req, res, resHeader);
//       resHeader = lower(resHeader);
//       const ifServerGzipped =  /gzip/i.test(resHeader['content-encoding']);
//       if(ifServerGzipped){
//           delete resHeader['content-encoding'];
//       }
//       delete resHeader['content-length'];         
//       userRes.writeHead(statusCode, resHeader);

//       var length,
//           resData = [];

//         res.on("data",function(chunk){
//             resData.push(chunk);
//         });

//         res.on("end",function(){
//             var serverResData;

//             async.series([
//                 function(callback){
//                     serverResData     = Buffer.concat(resData);
//                     if(ifServerGzipped ){
//                         zlib.gunzip(serverResData,function(err,buff){
//                             serverResData = buff;
//                             callback();
//                         });
//                     }else{
//                         callback();
//                     }
//                 },function(callback){
//                   serverResData = replaceResData(req, res, serverResData);
//                   userRes.end(serverResData);
//                   callback();
//                 },function(callback){
//                     resourceInfo.endTime    = new Date().getTime();
//                     resourceInfo.statusCode = statusCode;
//                     resourceInfo.resHeader  = resHeader;
//                     resourceInfo.resBody    = serverResData;
//                     resourceInfo.length     = serverResData ? serverResData.length : 0;
//                     callback();
//                 }
//             ],function(err,result){
//                 callback && callback();
//             });

//         });
//         res.on('error',function(error){
//             console.log('error' + error);
//         });

//     });

//     proxyReq.on("error",function(e){
//       console.log("err with request :" + e + "  " + req.url);
//       userRes.end();
//     });
//     proxyReq.end(reqData);
//   };
//   //
//   bindReqResolver(bindResResolver);
// }).listen(8001, () => {
//   console.log('8001 started');
// });
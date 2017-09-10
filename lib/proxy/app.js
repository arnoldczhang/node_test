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
const zlib = require('zlib');
const request = require('request');
const Buffer = require('buffer').Buffer;
const events = require('events');
const indexHtml = require('./index.html');

const {
  replaceReqData,
  replaceResData,
  replaceResHeader,
} = require('./rule');

const {
  lower,
  upper,
} = require('./utils');
const socket = require('./socket');

http.createServer((req, httpRes) => {
  let host = req.headers.host;
  let protocol = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http";
  let fullUrl = protocol === "http" ? req.url : (protocol + '://' + host + req.url);
  let urlPattern = url.parse(fullUrl);
  let path = urlPattern.path;
  let resourceInfo;
  let resourceInfoId = -1;
  let reqData;

  resourceInfo = {
    protocol,
    host,
    path,
    req,
    method: req.method,
    url: protocol + "://" + host + path,
    startTime: new Date().getTime(),
  };

  const bindReqResolver = (callback) => {
    const postData = [];
    req.on("data", (chunk) => {
      postData.push(chunk);
    });
    req.on("end", () => {
      reqData = Buffer.concat(postData);
      reqData = replaceReqData(req, reqData);
      resourceInfo.reqBody = reqData.toString();
      callback();
    });
  };

  const bindResResolver = (callback) => {
    const isSecure = /https/.test(protocol);
    const options = {
      hostname: urlPattern.hostname || host,
      port: urlPattern.port || req.port || (isSecure ? 443 : 80),
      path,
      method: req.method,
      headers: req.headers,
      rejectUnauthorized: false,
    };

    try{
      delete options.headers['accept-encoding']; //avoid gzipped response
    }catch(e){

    }

    options.headers = lower(options.headers);
    options.headers["content-length"] = reqData.length; //rewrite content length info
    options.headers = upper(options.headers);

    const proxyReq = (isSecure ? https : http).request(options, function(res) {
      const statusCode = res.statusCode;
      const resHeader = res.headers;
      replaceResHeader(req, res, resHeader);
      lower(resHeader);
      const ifServerGzipped =  /gzip/i.test(resHeader['content-encoding']);
      if(ifServerGzipped){
          delete resHeader['content-encoding'];
      }
      delete resHeader['content-length'];         
      httpRes.writeHead(statusCode, resHeader);

      let length;
      let resData = [];

      res.on("data",function(chunk){
          resData.push(chunk);
      });

      res.on("end",function(){
        let serverResData;

        async.series([
          function(callback){
            serverResData = Buffer.concat(resData);
            if(ifServerGzipped ){
              zlib.gunzip(serverResData,function(err,buff){
                serverResData = buff;
                callback();
              });
            }else{
              callback();
            }
          },function(callback){
            serverResData = replaceResData(req, res, serverResData);
            httpRes.end(serverResData);
            callback();
          },function(callback){
            resourceInfo.endTime = new Date().getTime();
            resourceInfo.statusCode = statusCode;
            resourceInfo.resHeader = resHeader;
            resourceInfo.resBody = serverResData;
            resourceInfo.length = serverResData ? serverResData.length : 0;
            callback();
          }
        ],function(err,result){
          const {
            url,
            resBody,
          } = resourceInfo;
          // request({
          //     url: 'http://127.0.0.1:8002/update',
          //     method: "POST",
          //     json: true,
          //     headers: {
          //         "content-type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       url,
          //       resBody,
          //     })
          // }, (error, res, body) => {
          //     if (!error && res.statusCode == 200) {

          //     }
          // });
          socket.send({
            url,
          });
          callback && callback();
        });

      });
      res.on('error',function(error){
          console.log('error' + error);
      });

    });

    proxyReq.on("error",function(e){
      console.log("err with request :" + e + "  " + req.url);
      httpRes.end();
    });
    proxyReq.end(reqData);
  };
  //
  bindReqResolver(bindResResolver);
}).listen(8001, () => {
  console.log('8001 started');
});


let html = 'aaa';
const emitter = new events.EventEmitter();

http.createServer((req, viewRes) => {
  const postData = [];
  const isView = req.url.length === 1;

  req.on('data', (chunk) => {
    postData.push(chunk);
  });

  req.on('end', () => {
    let reqData = Buffer.concat(postData);
    if (!isView) {
      if (/update/.test(req.url)) {
        reqData = JSON.parse(JSON.parse(reqData.toString()));
        let html = `<p>${reqData.url}</p>`;
        emitter.emit('update', html);
      }
    }

    else {
      console.log(111111111111)
    }
  });

  if (!isView) {

  }

  else {
    
    viewRes.write(indexHtml);
  }

}).listen(8002, () => {
  console.log('8002 started');
});
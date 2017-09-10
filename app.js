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

const lower = (obj) => {
  for(var key in obj){
      var val = obj[key];
      delete obj[key];

      obj[key.toLowerCase()] = val;
  }
  return obj;
};

const upper = (obj) => {
  var upperObject = {};
  for(var key in obj) {
      var upperKey = changeCase.headerCase(key);
      upperObject[upperKey] = obj[key];
  }
  return upperObject;
};

const replaceReqData = (req, data) => {
  // 请求数据处理
  return data;
};

const replaceResData = (req, res, data) => {
  // 返回数据处理
  return data;
};

const replaceResHeader = (req, res, header) => {
  // 返回头
  const host = header.host;
  const cookie = header.cookie;
  if (/\.51ping\.com/.test(host)) {
    if (cookie) {
      const dper = (cookie.match(/dper=([^;]+)/) || [])[1];
      if (dper) {
        console.log('dper=============>', dper);
        header["Set-Cookie"] = `dper=${dper}; Path=/; domain=.51ping.com; HttpOnly`;
      }
    }
  }
  return header;
};

http.createServer((req, userRes) => {
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
      resHeader = lower(resHeader);
      const ifServerGzipped =  /gzip/i.test(resHeader['content-encoding']);
      if(ifServerGzipped){
          delete resHeader['content-encoding'];
      }
      delete resHeader['content-length'];         
      userRes.writeHead(statusCode, resHeader);

      var length,
          resData = [];

        res.on("data",function(chunk){
            resData.push(chunk);
        });

        res.on("end",function(){
            var serverResData;

            async.series([
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
                },function(callback){
                  serverResData = replaceResData(req, res, serverResData);
                  userRes.end(serverResData);
                  callback();
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
  };
  //
  bindReqResolver(bindResResolver);
}).listen(8001, () => {
  console.log('8001 started');
});
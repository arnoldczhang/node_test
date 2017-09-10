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
const ip = require("ip");
const mime = require('mime-types');
const path = require("path");
const net = require("net");

const indexHtml = fs.readFileSync(__dirname + '/index.html', 'utf-8');
const {
  replaceReqData,
  replaceResData,
  replaceResHeader,
} = require('./rule');

const {
  lower,
  upper,
} = require('./utils');
let broadcast;

const server = http.createServer((req, httpRes) => {
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
          broadcast({
            type: 'update',
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
  broadcast = require('./socket');
});

server.on('connect', (req, socket, head) => {
  const url = req.url;
  const host = url.split(":")[0];
  const targetPort = req.url.split(":")[1];

  try{
    const conn = net.connect(targetPort, host, function(){
      socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8', function(){
        conn.pipe(socket);
        socket.pipe(conn);
      });
    });

    conn.on("error",function(e){
    });
  }catch(e){
  }
});

http.createServer((req, viewRes) => {
  const postData = [];
  let reqData;
  let result;
  let filepath;
  let file;
  req.on('data', (chunk) => {
    postData.push(chunk);
  });

  req.on('end', () => {
    reqData = Buffer.concat(postData);
  });

  if (/^\/$/.test(req.url)) {
    viewRes.setHeader("Content-Type", "text/html");
    viewRes.end(indexHtml);
  }

  else if (result = req.url.match(/\/(.+)/)) {
    filepath = `${__dirname}/${result[1]}`;
    fs.readFile(filepath, (err, buffer) => {
      viewRes.writeHead(200, {
        'Content-Type': mime.contentType(path.extname(filepath)),
      });
      viewRes.end(buffer);
    });
  }
}).listen(8002, () => {
  console.log('8002 started');
});

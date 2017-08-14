const express = require('express');
const utility = require('utility');
const http = require('http');
const superagent = require('superagent');
const cheerio = require('cheerio');
// const app = express();
const co = require('co');
const koa = require('koa');

const app = new koa();

app.use(async (ctx, next) => {
  ctx.body = 'Hello World';
}).listen(3000, () => {
  console.log('koa app start at port 3000');
});






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
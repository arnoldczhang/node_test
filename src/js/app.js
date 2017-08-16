"use strict";
var koa = require('koa');
var Hello_1 = require('./Hello');
var client_1 = require('./client');
var server_1 = require('react-dom/server');
var app = new koa();
function renderFullPage(html, initialState) {
    return "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n    </head>\n    <body>\n      <div id=\"root\">\n          " + html + "\n      </div>\n      <script>\n        window.__INITIAL_STATE__ = " + JSON.stringify(initialState) + ";\n      </script>\n      <script>" + client_1.default + "</script>\n    </body>\n    </html>\n  ";
}
app.use(function (ctx) {
    ctx.body = renderFullPage(server_1.renderToString(Hello_1.default('aa')), {});
}).listen(3000, function () {
    console.log('server started');
});
//# sourceMappingURL=app.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var httpServer = http.createServer(function (req, res) {
    res.write('hello world');
    res.write('hello world');
    res.end('hello world');
});
httpServer.listen(3000, function () {
    console.log('app starts at prot 3000');
});
//# sourceMappingURL=app.js.map
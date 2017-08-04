const http = require('http');
const httpServer = http.createServer((req, res) => {
    res.write('hello world');
    res.write('hello world');
    res.write('hello world');
    res.end('hello world');
});
httpServer.listen(3000, () => {
    console.log('app start at prot 3000');
});
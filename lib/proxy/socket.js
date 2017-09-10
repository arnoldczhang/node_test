const WebSocketServer = require('ws').Server;
const io = new WebSocketServer({ port: 8003 });
let globalSocket;
console.log('websocket server start at 8003...');

io.on('connection', (socket) => {
  globalSocket = socket;
  console.log('websocket server connected...');
  socket.on('message', (obj) => {
    socket.send(JSON.stringify(obj));
  });
});

io.on("close",function(){
  
});

io.on('error', (err) => {
    console.log('websocket error...')
});

const broadcast = (obj) => {
  io.clients.forEach((client) => {
    if (client.readyState == 1) {
      client.send(JSON.stringify(obj));
    }
  });
};

module.exports = broadcast;
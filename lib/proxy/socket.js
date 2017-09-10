const WebSocketServer = require('ws').Server;
const io = new WebSocketServer({ port: 3003 });
console.log('websocket server start at 3003...');

io.on('connection', (socket) => {
  socket.on('message', (obj) => {

  });
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

module.exports = {
  websocket: io,
};
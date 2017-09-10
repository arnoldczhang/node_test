var container = document.getElementById('container');
connect();

function connect() {
  var socket = new WebSocket('ws://192.168.1.2:8003');
  //
  socket.onopen = function (e) {
    
  };

  //
  socket.onmessage = function (event) { 
    var data = JSON.parse(event.data);
    var li = document.createElement('li');
    li.textContent = data.url;
    container.appendChild(li);
  };

  //
  socket.onclose = function(e) {
    console.log("无法连接websocket");
  };

  //
  socket.onerror = function (event) { 
    console.log();
  };
};
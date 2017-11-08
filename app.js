var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

users = [];
connections = [];

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);
  socket.on('disconnect', (data) => {
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1);
      updateUserNames();
    }
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.on('send message', (data) => {
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });

  function updateUserNames() {
    io.sockets.emit('get users', users)
  }
});

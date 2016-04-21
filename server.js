const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res)  {
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
                 .listen(port, function() {
  console.log('Listening on port ' + port + '.');
});

module.exports = server;

// Websocket Magic:

var votes = {};

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  socket.emit('statusMessage', 'You are connected.');

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function(channel, message) {
    if(channel === 'voteCast') {
      votes[socket.id] = message;
      var time = new Date();
      socket.emit('myVote', {vote: message, time: time.toLocaleString() });
      socket.emit('voteTally', countVotes(votes));
    }
  });

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteTally', countVotes(votes));
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function countVotes(votes) {
  var voteTally = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for(var vote in votes) {
    voteTally[votes[vote]]++;
  }
  return voteTally;
}

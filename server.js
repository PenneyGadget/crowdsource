const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const generateId = require('./lib/generate-id');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');

app.locals.title = 'Crowdsource';
app.locals.polls = {};

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/polls', (req, res) => {
  var id = generateId();

  app.locals.polls[id] = req.body;
  poll = app.locals.polls[id];
  poll.votes = {};

  res.redirect('/poll/' + id + '/admin');
});

app.get('/poll/:id/admin/', (req, res) => {
  poll = app.locals.polls[req.params.id];
  res.render('admin-poll', { poll: poll, identifier: { id: req.params.id } });
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
                 .listen(port, function() {
  console.log('Listening on port ' + port + '.');
});

module.exports = server;

// Websocket Magic:

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function(channel, message) {
    if(channel === 'voteCast') {
      var votes = app.locals.votes[message.id];
      var time = new Date();
      socket.emit('voteTally', countVotes(votes));
      socket.emit('myVote', {vote: message, time: time.toLocaleString() });
    }
    // } else if(channel === 'closePoll') {
    //   var votes = app.locals.votes[message.id];
    //   poll.closed = true;
    //   socket.emil('disablePoll');
    // }
  });

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    // delete app.locals.votes[socket.id];
    // socket.emit('voteTally', countVotes(votes));
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

const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const generateId = require('./lib/generate-id');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.locals.title = 'Crowdsource';
app.locals.polls = {};

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/polls', (req, res) => {
  var id = generateId();
  var poll = req.body.poll;
  app.locals.polls[id] = poll;
  poll.id = id;
  poll.votes = {};
  poll.options.forEach(function(option){
    if (option !== '') {
      poll.votes[option] = 0;
    }
  });
  poll.closed = false;
  // Need to set a timer here
  res.redirect('/poll/' + id + '/admin');
});

app.get('/poll/:id/admin/', (req, res) => {
  poll = app.locals.polls[req.params.id];
  res.render('admin-poll', { poll: poll, identifier: { id: req.params.id } });
});

app.get('/poll/:id', (req, res) => {
  poll = app.locals.polls[req.params.id];
  res.render('poll', { poll: poll, identifier: { id: req.params.id } });
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

  io.sockets.emit('userConnected', io.engine.clientsCount);

  socket.on('message', function(channel, message) {
    //message.option == BUTTON CLICKED
    //message.id == POLL ID
    if(channel === 'voteCast') {
      var poll = app.locals.polls[message.id];
      var chosenOption = message.option;
      poll.votes[chosenOption]++;
      var time = new Date();
      socket.emit('voteTally', {votes: poll.votes});
      socket.emit('myVote', {vote: message, time: time.toLocaleString() });
    } else if(channel === 'closePoll') {
      var poll = app.locals.polls[message.id];
      poll.closed = true;
      io.sockets.emit('disablePoll');
    }
  });

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    // delete app.locals.votes[socket.id];
    // socket.emit('voteTally', countVotes(votes));
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

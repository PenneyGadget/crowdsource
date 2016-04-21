const socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var voteTally = document.getElementById('vote-tally');
var myVote = document.getElementById('my-vote');
var buttons = document.querySelectorAll('#choices button');

for(var i=0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

socket.on('voteTally', function(votes) {
  voteTally.innerHTML = '';
  Object.keys(votes).forEach(appendVote.bind(votes));
});

socket.on('myVote', function(data) {
  var formattedTime = data.time.split(", ");
  myVote.innerText = 'Thanks for voting! You chose ' + data.vote + ' on ' + formattedTime[0] + ' at ' + formattedTime[1];
});

var appendVote = function(option, index) {
  var newElem = document.createElement('li');
  newElem.innerHTML = option + ': ' + this[option];
  voteTally.appendChild(newElem);
};

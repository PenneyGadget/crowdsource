const socket = io();

var connectionCount = document.getElementById('connection-count');
var voteTally = document.getElementById('vote-tally');
var myVote = document.getElementById('my-vote');
var buttons = document.querySelectorAll('#choices button');
var submittedVotes = 0;
var pollId = window.location.pathname.split('/')[2];

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    if (submittedVotes >= 1){
      myVote.innerText = "You have already cast a vote.";
    } else {
    socket.send('voteCast', {option: this.innerText, id: pollId});
    submittedVotes ++;
    }
  });
}

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('voteTally', function(votes) {
  voteTally.innerHTML = '';
  Object.keys(votes).forEach(appendVote.bind(votes));
});

socket.on('myVote', function(data) {
  var formattedTime = data.time.split(", ");
  // console.log(data);
  myVote.innerText = 'Thanks for voting! You chose ' + data.vote.option + ' on ' + formattedTime[0] + ' at ' + formattedTime[1];
});

var appendVote = function(option, index) {
  var newElem = document.createElement('li');
  newElem.innerHTML = option + ': ' + this[option];
  voteTally.appendChild(newElem);
};

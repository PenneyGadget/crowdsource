const socket = io();

var connectionCount = document.getElementById('connection-count');
var voteTally = document.getElementById('vote-tally');
var myVote = document.getElementById('my-vote');
var closeMessagePublic = document.getElementById('close-message-public');
var buttons = document.querySelectorAll('#choices button');
var closePollButton = document.getElementById('close-poll');
var submittedVotes = 0;
var pollId = window.location.pathname.split('/')[2];

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    if (submittedVotes >= 1){
      myVote.innerText = "You have already cast a vote.";
    } else {
    socket.send('voteCast', { option: this.innerText, id: pollId });
    submittedVotes ++;
    }
  });
}

if (typeof(closePollButton) !== undefined && closePollButton !== null) {
  closePollButton.addEventListener('click', function() {
    socket.send('closePoll', { id: pollId });
  });
}

socket.on('usersConnected', function(count) {
  if(connectionCount){
    connectionCount.innerText = 'Connected Users: ' + count;
  }
});

socket.on('myVote', function(data) {
  var formattedTime = data.time.split(", ");
  myVote.innerText = 'Thanks for voting! You chose ' + data.vote.option + ' on ' + formattedTime[0] + ' at ' + formattedTime[1];
});

socket.on('voteTally', function(data) {
  if(voteTally){
    voteTally.innerHTML = '';
    Object.keys(data.votes).forEach(appendVote.bind(data.votes), data.votes);
  }
});

socket.on('disablePoll', function(closeId) {
  console.log("IN THE CLIENT", closeId, pollId);
  if(closeId === pollId) {
    if(closePollButton){
      closePollButton.insertAdjacentHTML('afterend', '<h3 class="close-message">This Poll is Finito!</h3>');
      closePollButton.setAttribute('class', 'hidden');
    } else {
      closeMessagePublic.innerHTML = "Sorry, this poll is now closed.";
    }
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('disabled', 'disabled');
    }
  }
});

var appendVote = function(option, index) {
  var newElem = document.createElement('li');
  newElem.innerHTML = option + ": " + this[option];
  voteTally.appendChild(newElem);
};

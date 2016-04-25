exports.invalidPollOne = {
  id: 'abc123',
  name: '',
  options: [ 'pizza', 'sushi', 'salad', 'tacos', '', '' ],
  votes: { pizza: 1, sushi: 7, salad: 0, tacos: 3 },
  closed: false
};

exports.invalidPollTwo = {
  id: 'abc123',
  name: 'Food',
  options: [ 'pizza', '', '', '', '', '' ],
  votes: { pizza: 1, sushi: 7, salad: 0, tacos: 3 },
  closed: false
};

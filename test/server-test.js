const assert = require('assert');
const request = require('request');
const app = require('../server');
const validPoll = require('./fixtures/valid-poll');
const closedPoll = require('./fixtures/closed-poll');


describe('Server', () => {
  before((done) => {
    this.port = 9876;

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {
    it('should return a 200 OK', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have the title on the page', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes("Crowdsource"),
          `"${response.body}" does not include "Crowdsource"`);
        done();
      });
    });
  });

  describe('POST /polls', () => {

    beforeEach(() => {
      app.locals.polls = {};
    });

    it('should not return 404', (done) => {
      var payload = { poll: validPoll.validPoll };

      this.request.post('/polls', { form: payload }, (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should receive and restore data', (done) => {
      var payload = { poll: validPoll.validPoll };

      this.request.post('/polls', { form: payload }, (error, response) => {
        if (error) { done(error); }

        var pollCount = Object.keys(app.locals.polls).length;

        assert.equal(pollCount, 1, `Expected 1 poll(s), found ${pollCount}`);

        done();
      });
    });

    it('should redirect the user to the admin page', (done) => {
      var payload = { poll: validPoll.validPoll };

      this.request.post('/polls', { form: payload }, (error, response) => {
        if (error) { done(error); }
        var newPollId = Object.keys(app.locals.polls)[0];
        assert.equal(response.headers.location, '/poll/' + newPollId + '/admin');
        done();
      });
    });
  });

  describe('GET /poll/:id', () => {

    beforeEach(() => {
      app.locals.polls.testPoll = validPoll.validPoll;
      app.locals.polls.closedPoll = closedPoll.validPoll;
    });

    it('should not return 404', (done) => {
      this.request.get('/poll/testPoll', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should return a page that has the title of the poll', (done) => {
      var poll = app.locals.polls.testPoll;

      this.request.get('/poll/testPoll', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(poll.name),
          `"${response.body}" does not include "${poll.name}".`);
        done();
      });
    });

    it('should return a page that has the poll options', (done) => {
      var poll = app.locals.polls.testPoll;

      this.request.get('/poll/testPoll', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(poll.options[0]),
          `"${response.body}" does not include "${poll.options.first}".`);
        done();
      });
    });

    it('should show closed poll message if poll is closed', (done) => {
      var poll = app.locals.polls.closedPoll;

      this.request.get('/poll/closedPoll', (error, response) => {
        if(error) { done(error); }
        assert(response.body.includes("***Sorry, this poll is now closed***"));
        done();
      });
    });
  });

  describe('GET /poll/:id/admin', () => {

    beforeEach(() => {
      app.locals.polls.testPoll = validPoll.validPoll;
      app.locals.polls.closedPoll = closedPoll.validPoll;
    });

    it('should not return 404', (done) => {
      this.request.get('/poll/testPoll/admin', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should return a page with correct admin info', (done) => {
      var poll = app.locals.polls.testPoll;

      this.request.get('/poll/testPoll/admin', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(poll.name), `"${response.body}" does not include "${poll.name}"`);
        assert(response.body.includes(poll.options[0]), `"${response.body}" does not include "${poll.options.first}"`);
        assert(response.body.includes(poll.options[2]), `"${response.body}" does not include "salad"`);
        assert(response.body.includes("Close Poll"), `"${response.body}" does not include "Close Poll"`);
        assert(response.body.includes("Current Votes"), `"${response.body}" does not include "Current Votes"`);
        done();
      });
    });

    it('should show an admin and public link', (done) => {
      var poll = app.locals.polls.testPoll;

      this.request.get('/poll/testPoll/admin', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes('<a href="/poll/testPoll/admin">Admin Link</a>'));
        assert(response.body.includes('<a href="/poll/testPoll" target="_blank">Public Link</a>'));
        done();
      });
    });

    it('should show closed poll message if poll is closed', (done) => {
      var poll = app.locals.polls.closedPoll;

      this.request.get('/poll/closedPoll/admin', (error, response) => {
        if(error) { done(error); }
        assert(response.body.includes("This poll is Finito!"));
        done();
      });
    });

  });

});

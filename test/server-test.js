const assert = require('assert');
const request = require('request');
const app = require('../server');
const fixtures = require('./fixtures');

describe('Server', () => {
  before((done) => {
    this.port = 3000;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
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
      request.get('http://localhost:3000', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have the title on the page', (done) => {
      request.get('http://localhost:3000', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes('Crowdsource'),
          `"${response.body}" does not include "Crowdsource"`);
        done();
      });
    });
  });

  describe('POST /polls', () => {
    it('should return a 200 OK', (done) => {
      request.get('http://localhost:3000', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
});

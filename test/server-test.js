const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const fixturs = require('./fixtures');

describe('GET /', function(){
  it('responds with a 200 OK', function(done){

    request(app).get('/').expect(200, done);

  });
});

describe('undefined routes', function(){
  it('responds with a 404', function(done){

    request(app).get('/puppies').expect(404, done);

  });
});

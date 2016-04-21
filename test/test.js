var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server');

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

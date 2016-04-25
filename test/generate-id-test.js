const assert = require('assert');
const generateId = require('../lib/generate-id.js');

describe('generateId', () => {
  it('should create a random id 20 characters long', () => {
    assert.equal(generateId().length, 20);
  });
});

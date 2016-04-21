const crypto = require('crypto');

module.exports = () => {
  return crypto.randomBytes(10).toString('hex');
};

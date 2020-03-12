var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '741660',
  key: 'ba4379b5d1d63ad32c26',
  secret: '32bca46af296caa884b0',
  cluster: 'ap2',
  encrypted: true
});

module.exports = pusher;
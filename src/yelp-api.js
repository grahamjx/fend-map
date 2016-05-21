var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'grdu059yZnn_-J5PDxYT7g',
  consumer_secret: '-p-4y4IdUDSuBqUB9vBy6LD33Cs',
  token: '3rOjHkHrJaO0FvAwV9URBe3h5lGVpKut',
  token_secret: 'bLfUZZMXawYX55-oQzoKawiC9Zg',
});

yelp.search({ term: 'food', location: 'Alameda, CA', limit: 1 })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.error(err);
  });

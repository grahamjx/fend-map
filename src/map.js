var Yelp = require('./yelp-api.js');


var map;    // declares a global map variable

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 37.7652065, lng: -122.2416355},
    zoom: 13
  });

function pinSearch() {
    yelp.search({ term: 'food', location: 'Alameda, CA', limit: 1 })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.error(err);
      })
  };
  pinSearch();
}
window.addEventListener('load', initMap);

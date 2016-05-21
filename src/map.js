var map;    // declares a global map variable

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 37.7652065, lng: -122.2416355},
    zoom: 13
  });

function pinSearch() {
    $.getJSON('https://api.foursquare.com/v2/venues/search?client_id=J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R&client_secret=XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY&v=20130815&ll=37.7,-122&query=mexican',
    function(data){
      console.log(data);
    });
  }
  pinSearch();
}

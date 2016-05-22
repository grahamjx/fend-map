var map;    // declares a global map variable
var googleMap = {};

googleMap.initMap = function(){
  map = new google.maps.Map(document.getElementById("map"), {
  center: {lat: 37.7652065, lng: -122.2416355},
  zoom: 13
  })
}

googleMap.locationFinder = function(){
   var locations = [];

   vm.filteredItems().forEach(function(place){
     locations.push(place.name);
   });
   return locations;
 }

googleMap.createMapMarker = function (placeData) {
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.name;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });
    places.marker = marker;
    console.log(places.marker);
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      map.setCenter(marker.position);
      map.setZoom(16);
      infoWindow.open(map, marker);
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function() {
      map.setCenter({lat: 37.7652065, lng: -122.2416355});
      map.setZoom(13);
    });
  }



    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    //bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    //map.fitBounds(bounds);
    // center the map
    //map.setCenter(bounds.getCenter());


  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
/*googleMap.callback = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  /*function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
      locations.forEach(function(place){
      // the search request object
      var request = {
        query: place
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    });
  }*/

  // Sets the boundaries of the map based on pin locations
  //window.mapBounds = new google.maps.LatLngBounds();

  locations = googleMap.locationFinder(places);
  //console.log(locations);
  //pinPoster(locations);



/*function pinSearch() {
    $.getJSON('https://api.foursquare.com/v2/venues/40a55d80f964a52020f31ee3?client_id=J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R&client_secret=XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY&v=20130815&ll=37.7,-122',
    function(data){
      console.log(data);
    });
  }
  pinSearch();*/

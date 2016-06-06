//This is my main JavaScript file used for the map application.

var map,
    FOURSQUARE_API_CLIENT = 'J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R',
    FOURSQUARE_API_SECRET = 'XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY',

//Starting data
    placeData = [
  {"name": "Island Taqueria",
   "venue": "4dd857ab2271c5d36d52eaf0",
   "lat": 37.765768,
   "lng": -122.241637},
  {"name": "South Shore Cafe",
   "venue": "4bc20e70b492d13a3fdca660",
   "lat": 37.75757837706282,
   "lng": -122.25251336681507},
  {"name": "Speisekammer",
   "venue": "463de5c9f964a5203f461fe3",
   "lat": 37.766064487213704,
   "lng": -122.2401211982562},
  {"name": "USS Hornet Museum",
   "venue": "4a6cbe2df964a5207dd11fe3",
   "lat": 37.772453282779324,
   "lng": -122.30214357376097},
  {"name": "Kamakura Japanese Restaurant",
   "venue": "4645be7ef964a5207f461fe3",
   "lat": 37.763658373312516,
   "lng": -122.23850548267365}
];


// Creates the map and sets a comfortable center point
function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
  disableDefaultUI: true});

  window.mapBounds = new google.maps.LatLngBounds();

  //event listener to handle window resize
  google.maps.event.addDomListener(window, "resize", function() {
    map.fitBounds(mapBounds);
});

  ko.applyBindings(new listViewModel());
}

//Helper function that compares string values used in the filtering function
function stringStartsWith(string, startsWith) {
  string = string || "";
  if (startsWith.length > string.length)
    return false;
  return string.substring(0, startsWith.length) === startsWith;
}

// Overall viewmodel
function listViewModel() {
  var self = this;
  var lastInfoWindow = null;

  self.itemToFilter = ko.observable('');
  self.placesArray = ko.observableArray(placeData); //contains the orignal model data

//Function is used to animate the markers and open/close info windows appropriately
  self.pinAnimation = function(marker, infoWindow) {
		function bounce() {
      map.setCenter(marker.getPosition());
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){marker.setAnimation(null); }, 1900);
		};

		return function() {
			if (lastInfoWindow === infoWindow) {
	          	bounce(marker);
	          	infoWindow.close(map, this);
              map.fitBounds(mapBounds);
	          	lastInfoWindow = null;
      }
	    else {
	      if(lastInfoWindow !== null) {
	      lastInfoWindow.close(map, this);
	      bounce(marker);
        }
          bounce(marker);
	        infoWindow.open(map, this);
          lastInfoWindow = infoWindow;
	    }
		}
	};

/* For each place in the array, I create a simple map marker and info window. The
   marker uses the static information found in the starting model data. After the
   basics are created, a getJSON is called using the foursquare API. The return data
   is the used to populate a content string and eventually update the info window.
   If there is an error in the API, the markers are still created and the app can still function.

   TODO: have googlePlaces find the locations rather
   than using hard coded results.*/

  self.placesArray().forEach(function(place) {

    place.marker = new google.maps.Marker({
      map: map,
      position: {lat: place.lat, lng: place.lng},
      title: place.name
    });

    place.infoWindow = new google.maps.InfoWindow({
      content: place.name
    });

    google.maps.event.addListener(place.marker, 'click', self.pinAnimation(place.marker, place.infoWindow));

    google.maps.event.addListener(place.infoWindow, 'closeclick', function() {
      lastInfoWindow = null;
      map.fitBounds(mapBounds);
    });

    $.getJSON('https://api.foursquare.com/v2/venues/'+ place.venue + '?client_id='+ FOURSQUARE_API_CLIENT + '&client_secret=' + FOURSQUARE_API_SECRET + '&v=20130815&ll=37.7,-122')

    .done(function(data) {
      var response = data.response.venue;
      var description = response.hasOwnProperty('description') ? response.description : '';


      var contentString = '<div class="infowindow">'+
      '<h1>'+ response.name +'</h1>'+ '<div id="pic"><img src="' +
      response.bestPhoto.prefix + '210x210' + response.bestPhoto.suffix +
      '" alt="Image Location"></div><p><b>Category: </b>' + response.categories[0].name + '</p><p>' + description + '</p><p><b>Phone: </b>' +
      response.contact.formattedPhone + '</p><p><b>Address: </b> <a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
      response.location.lat + ',' + response.location.lng + '>' + response.location.formattedAddress + '</a></p><p><b>Source: </b>' +
      '<a target="_blank" href=' + response.canonicalUrl +
      '>Foursquare Page</a></div>';

      place.infoWindow.setContent(contentString);
    })

    //If the API isn't working, it will alert the user that the foursquare information is unavailable
    .fail(function() {
      var contentString = place.name + '<h5>Foursquare data is unavailable. Please try again!</h5>'
      place.infoWindow.setContent(contentString);
    })

    mapBounds.extend(new google.maps.LatLng(place.lat, place.lng));
    map.fitBounds(mapBounds);
  });

  //Clicking on the list will trigger the map marker
  self.markerClick = function(place){
    google.maps.event.trigger(place.marker, 'click');
  }

  //Resets the visability of all the markers
  self.resetMarkers = function() {
        self.placesArray().forEach(function(place){
          place.marker.setVisible(true);
          map.fitBounds(mapBounds);
        })
    };

  /*Takes input data from the user and compares it with what is in the list.
    The corresponding map marker's visability is set so that the displayed list items
    and pins on the map are the same.*/

  self.filteredItems = ko.computed(function() {
    var filter = self.itemToFilter().toLowerCase();
    if (!filter) {
        if (self.placesArray()[0].hasOwnProperty('marker')) {
          self.resetMarkers();
        }
        return self.placesArray();
    } else {
        return(ko.utils.arrayFilter(self.placesArray(), function(place) {
            var visible = stringStartsWith(place.name.toLowerCase(), filter);
            place.marker.setVisible(visible);
            return visible;
        }));
    }
  });
}

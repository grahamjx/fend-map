//This is my main JavaScript file used from the map application.

var map,
    FOURSQUARE_API_CLIENT = 'J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R',
    FOURSQUARE_API_SECRET = 'XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY',

/* Starting data. Only contains the name as a reference for myself. All the information
  including location is pull from the foursquare api. */

    placeData = [
  {"name": "Island Taqueria",
   "venue": "4dd857ab2271c5d36d52eaf0"},
  {"name": "South Shore Cafe",
   "venue": "4bc20e70b492d13a3fdca660"},
  {"name": "Speisekammer",
   "venue": "463de5c9f964a5203f461fe3"},
  {"name": "USS Hornet Museum",
   "venue": "4a6cbe2df964a5207dd11fe3"},
  {"name": "Kamakura Japanese Restaurant",
   "venue": "4645be7ef964a5207f461fe3"}
];


// Creates the map and sets a comfortable center point
function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
  center: {lat: 37.7652065, lng: -122.2416355},
  disableDefaultUI: true,
  zoom: 13});

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

  /* For each place in the array, it runs a getJSON call to the foursquare api using my account information.
     When it's done, it takes the data and creates a corresponding map marker and info window containing the
     specificed information. It's important to note, that the marker placement uses the location provided by
     fourquare not googlePlaces data. */

  self.placesArray().forEach(function(place) {

    $.getJSON('https://api.foursquare.com/v2/venues/'+ place.venue + '?client_id='+ FOURSQUARE_API_CLIENT + '&client_secret=' + FOURSQUARE_API_SECRET + '&v=20130815&ll=37.7,-122')

    .done(function(data) {
      var response = data.response.venue;
      var description = response.hasOwnProperty('description') ? response.description : '';

      place.marker = new google.maps.Marker({
        map: map,
        position: {lat: response.location.lat, lng: response.location.lng},
        title: response.name
      });


      var contentString = '<div class="infowindow">'+
      '<h1>'+ response.name +'</h1>'+ '<div id="pic"><img src="' +
      response.bestPhoto.prefix + '210x210' + response.bestPhoto.suffix +
      '" alt="Image Location"></div><p><b>Category: </b>' + response.categories[0].name + '</p><p>' + description + '</p><p><b>Phone: </b>' +
      response.contact.formattedPhone + '</p><p><b>Address: </b> <a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
      response.location.lat + ',' + response.location.lng + '>' + response.location.formattedAddress + '</a></p><p><b>Source: </b>' +
      '<a target="_blank" href=' + response.canonicalUrl +
      '>Foursquare Page</a></div>';

      place.infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(place.marker, 'click', self.pinAnimation(place.marker, place.infoWindow));

      google.maps.event.addListener(place.infoWindow, 'closeclick', function() {
        lastInfoWindow = null;
      });
    })

    //If the API isn't working, it will ale
    .fail(function() {
      alert("Error loading Foursquare API Data! Map marker could not be created. Please see developer console for more information.");
    })
  });

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

  self.markerClick = function(place){
    google.maps.event.trigger(place.marker, 'click');
  }

  self.resetMarkers = function() {
        self.placesArray().forEach(function(place){
          place.marker.setVisible(true);
        })
    };

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

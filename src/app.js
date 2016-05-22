function stringStartsWith(string, startsWith) {
  string = string || "";
  if (startsWith.length > string.length)
    return false;
  return string.substring(0, startsWith.length) === startsWith;
};

var places = [
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

/* Class to represent a row in the seat reservations grid
function restaurant (name) {
    this.name = name;
    //self.meal = ko.observable(initialMeal);
}*/


// Overall viewmodel for this screen, along with initial state
var listViewModel = function(places) {
  var self = this;

  self.itemToFilter = ko.observable('');
  self.placesArray = ko.observableArray(places);

  self.placesArray().forEach(function(place) {
    $.getJSON('https://api.foursquare.com/v2/venues/'+ place.venue + '?client_id=J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R&client_secret=XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY&v=20130815&ll=37.7,-122',
      function (data) {
        var location = {lat: data.response.venue.location.lat, lng: data.response.venue.location.lng}
        var name = data.response.venue.name;
        place.marker = new google.maps.Marker({
          map: map,
          position: location,
          title: name
        });
        place.infoWindow = new google.maps.InfoWindow({
          content: name
        });

        google.maps.event.addListener(place.marker, 'click',
          //map.setCenter(place.marker.position);
          //map.setZoom(16);
          //place.infoWindow.open(map, place.marker);
          self.handleThis(place.marker, place.infoWindow));

        google.maps.event.addListener(place.infoWindow, 'closeclick', function() {
          map.setCenter({lat: 37.7652065, lng: -122.2416355});
          map.setZoom(13);
        });
      });
  });

  var lastInfoWindow = null;
  self.handleThis = function(marker, infoWindow) {
		function toggleBounce() {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){marker.setAnimation(null); }, 1900);
		};

		return function() {
			if (lastInfoWindow === infoWindow) {
	          	toggleBounce(marker);
	          	infoWindow.close(map, this);
	          	lastInfoWindow = null;

	        }
	        else {
	            	if(lastInfoWindow !== null) {
	                	lastInfoWindow.close(map, this);
	                	toggleBounce(marker);
	            	}
	        	toggleBounce(marker);
	            infoWindow.open(map, this);
	            lastInfoWindow = infoWindow;
	        }
		};
	};

  self.markerClick = function(place){
    google.maps.event.trigger(place.marker, 'click');
  }

  self.filteredItems = ko.computed(function() {
    var filter = self.itemToFilter().toLowerCase();
    if (!filter) {
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
var vm = new listViewModel(places);
ko.applyBindings(vm);

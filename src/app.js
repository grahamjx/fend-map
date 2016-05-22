function stringStartsWith(string, startsWith) {
  string = string || "";
  if (startsWith.length > string.length)
    return false;
  return string.substring(0, startsWith.length) === startsWith;
};

var places = [
  {"name": "Island Taqueria"
   "venue: 40a55d80f964a52020f31ee3"},
  {"name": "South Shore Cafe"},
  {"name": "Speisekammer"},
  {"name": "USS Hornet Museum"},
  {"name": "Kamakura Japanese Restaurant"}
];

// Class to represent a row in the seat reservations grid
function restaurant (name) {
    this.name = name;
    //self.meal = ko.observable(initialMeal);
}


// Overall viewmodel for this screen, along with initial state
var listViewModel = function(places) {
  var self = this;

  self.itemToFilter = ko.observable("");
  self.filter = ko.observable("");
  self.placesArray = ko.observableArray(places);

  self.filteredItems = ko.computed(function() {
    var filter = self.itemToFilter().toLowerCase();
    if (!filter) {
        return self.placesArray();
    } else {
        return(ko.utils.arrayFilter(self.placesArray(), function(place) {
            return stringStartsWith(place.name.toLowerCase(), filter);
        }));
    }
  });
}
var vm = new listViewModel(places);
ko.applyBindings(vm);

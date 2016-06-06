# Neighborhood Map


### Getting Started

This project uses gulp to build the web application and host it locally on port 8000.

1. [Install Node.js] (https://nodejs.org/en/download/)
2. Clone the repository
      
    `$ git clone https://github.com/slkcoin/FEND-map`

3. Navigate to the project folder and run npm install
  
  ```bash
  $> cd /path/to/your-project-folder
  $> npm install
  ```
4. This will install everything necessary to evaluate the project. If you're curious about what gets installed, check out the package.json file.


###The View

For this project I used the Pure.css framework and incorporated their responsive side-menu layout. After tweaking, this created a clean and easily accessible user interface.

###The ViewModel

Knockout.js is used as the connection between the UI and the model data. Items are filtered and and displayed accordingly. Observables allow consistent and smooth updates to the view without having to refresh the page.

###The Model

Location data is hard-coded in the placeData object.

###API

This project is powered by the Google Maps API and the Foursquare API. For each location, a getJSON to Foursquare is called and the corresponding infromation is used to populate info windows for each of the map markers.




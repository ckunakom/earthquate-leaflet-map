// Store earthquate API endpoint inside variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(geodata) {

    console.log(geodata);

    // Send features object from earthquateData to createFeatures fuction
    createFeatures(geodata.features);
});

// Function to create geoJSON layer and popup box
function createFeatures(earthquakeData) {
    // console.log(earthquakeData);

  // Define a function to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

    //   console.log(feature, layer);
  }

//     feature.properties.mag --> give's the magnitude or just use .title for place & mag

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

//   console.log(earthquakes);

  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to create map 
function createMap(earthquakes) {

  // Define grayscale, satellite and outdoors layers
  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    Grayscale: grayscalemap,
    Satellite: satellitemap,
    Outdoor: outdoormap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    // "Techtonic Plates": techtonicplates,
    "Earthquakes": earthquakes,
  };

  // Create our map, giving it the satellite map and techtonic plates + earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [55.3781, 3.436],
    zoom: 3,
    layers: [satellitemap, earthquakes]
  });
  console.log(myMap);

  // Create a layer control with baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

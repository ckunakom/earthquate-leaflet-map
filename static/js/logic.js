//====== BUILDING DEFAULT MAP ======//
// Define grayscale, satellite and outdoors layers
var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
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

// Create map object
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 3,
    layers: [grayscalemap]
});

// Define the two layer groups
var earthquakes = new L.LayerGroup();
var techtonicplates = new L.LayerGroup();

// Define a baseMaps object to hold our base layers
var baseMaps = {
    Grayscale: grayscalemap,
    Satellite: satellitemap,
    Outdoor: outdoormap,
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
    "Techtonic Plates": techtonicplates,
    "Earthquakes": earthquakes,
};

// Create a layer control with baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

//====== ADDING DATA TO THE MAP ======//
// Store techtonic data URL inside variable
var techtonicURL =  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Added techtonic plates data to the map
d3.json(techtonicURL, function(plateData) {

    // console.log(plateData)

    L.geoJson(plateData, {
        color: '#FF26A5',
        weight: 2
    
    }).addTo(techtonicplates);

    // Add techtonicplates data to map
    techtonicplates.addTo(myMap);

});

// Store earthquate API endpoint inside variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
d3.json(queryUrl, function(geodata) {

    // console.log(geodata);

    // Function to create circle markers for the earthquake
    function circleMarker(feature) {

        // Change color to indicate the depth
        function color(d) {
            var depth = feature.geometry.coordinates[2];
            // console.log(depth);
            if (depth > 90) return '#0A7B83';
            else if (depth >= 70) return '#2AA876';
            else if (depth >= 50) return '#6be86f';
            else if (depth >= 30) return '#FFD265';
            else if (depth >= 10) return '#F19C65';
            else return '#CE4D45';
        }

        // Change radius to indicate the magnitude
        function size(r) {
            var rad = feature.properties.mag;
            return rad / 0.4;
        }

        // Attribute to return for the circle markers
        return {
            radius: size(feature),
            fillColor: color(feature),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Function to create pop-up information about the earthquake
    function onEachFeature(feature, layer) {    
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><strong>Magnitude</strong>: ${feature.properties.mag}<br>
        <strong>Depth</strong>: ${feature.geometry.coordinates[2]}<br>
        <strong>Date & Time</strong>: ${new Date(feature.properties.time)}`);
    }

    L.geoJson(geodata, {
        // Turn data into circles
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, circleMarker(feature));
        },
        // Binding a pop-up to each layer
        onEachFeature: onEachFeature,
        // Adjust the radius according to the magnitude
        radius: geodata
    }).addTo(earthquakes);

    // Add earthquake data to map
    earthquakes.addTo(myMap);
});

//====== ADDING DATA LEGEND TO THE MAP ======//
// Set up the legend 
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {

    // Creating div with 'legend' info id
    var div = L.DomUtil.create("div", "info legend");
    // Define colors and labels
    var colors = ['#CE4D45', '#F19C65', '#FFD265', '#6be86f', '#2AA876', '#0A7B83']
    var labels = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < labels.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
    } 
    
    return div
};

// Adding legend to the map
legend.addTo(myMap);
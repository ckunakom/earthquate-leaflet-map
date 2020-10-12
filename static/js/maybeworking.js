// Create map object
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 5
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// Store earthquate API endpoint inside variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
d3.json(queryUrl, function(geodata) {

    console.log(geodata);

    // Color the marker according to the depth of the earthquake
    function circleColor(feature) {
        var color = "";
        switch (color) {
            case feature > 90: color = '#800026';
            case feature >= 70: color = '#BD0026';
            case feature >= 50: color = '#E31A1C';
            case feature >= 30: color = '#FC4E2A';
            case feature >= 10: color = '#FD8D3C';
            default: color = '#FEB24C';
        }
    }

    function circleMarker(feature) {
        return {
            radius: 8,
            fillColor: circleColor(feature.geometry.depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // var circleMarker = {
    //     radius: 8,
    //     fillColor: circleColor(feature.geometry.depth),
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // };
    
    function onEachFeature(feature, layer) {    
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
    }

    L.geoJson(geodata, {
        // Turn data into circles
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, circleMarker(feature));
        },
        // Binding a pop-up to each layer
        onEachFeature: onEachFeature,
        radius: geodata
    }).addTo(myMap);




});


//     // Create a new choropleth layer
//     var geojson = L.choropleth(geodata, {

//         // Define what  property in the features to use
//         valueProperty: "mag",

//         // Set color scale
//         scale: ["#ffffb2", "#b10026"],

//         // Number of breaks in step range
//         steps: 6,

//         // q for quartile, e for equidistant, k for k-means
//         mode: "q",
//         style: {
//             // Border color
//             color: "#fff",
//             weight: 1,
//             fillOpacity: 0.8
//         },


//     // Binding a pop-up to each layer
//     onEachFeature: function(feature, layer) {    
//         layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//     }
//     }).addTo(myMap);

//     // Set up the legend 
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//         var div = L.DomUtil.create("div", "info legend");
//         var limits = geojson.options.limits;
//         var colors = geojson.options.colors;
//         var labels = [];

//     // Add min & max
//     var legendInfo = "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//     };

//     // Adding legend to the map
//     legend.addTo(myMap);

// // }



//     // // Define marker size
//     // var markerSize = geodata.features.properties.mag;
//     // console.log(markerSize); // failed

// });
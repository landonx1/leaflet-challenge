const earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


function init() {
    plotEarthquakes();
}

function plotEarthquakes() {
    // get the data
    var features = [];

    d3.json(earthquakeurl).then(function(data) {
        var itms = data.features;
        itms.forEach(x => {+
            features.push(x);
        });

    var map = L.map('map').setView([38.7858315, -122.739502], 5);

    //Add title layer(you can choose different map styles by changing the URL)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    features.forEach(function(earthquake) {
        var lon = earthquake.geometry.coordinates[0];
        var lat = earthquake.geometry.coordinates[1];
        var depth = earthquake.geometry.coordinates[2];
        var loc = earthquake.properties.place;
        var size = earthquake.properties.mag;

        var circle = L.circle([lat, lon], {
            color: getColor(depth),
            fillColor: getColor(depth),
            fillOpacity: .5,
            radius: getRadius(size),
        }).addTo(map)
        .bindPopup("Earthquake Location: " + loc);
    });

    // create legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');

        var legendData = [
            { name: '-10-10', color: getColor(9) },
            { name: '10-30', color: getColor(11) },
            { name: '30-50', color: getColor(31) },
            { name: '50-70', color: getColor(51) },
            { name: '70-90', color: getColor(71) },
            { name: '90+', color: getColor(91) },
        ];

        div.innerHTML = getLegendData(legendData);
        return div;
    };

    legend.addTo(map);
});

}

// calculate radius
function getRadius(value) {
    return value * 15000
}

// calculate depth
function getDepth(value) {
    return value * .01
}

// define colors
function getColor(d) {
    return d < 10 ? "#FFCDD2":
    d > 10 & d < 30 ? "#FBC02D":
    d > 30 & d < 50 ? "#42A5F5":
    d > 50 & d < 70 ? "#00838F":
    d > 70 & d< 90 ? "#C62828":
        "#311B92";
}

// create legend
function getLegendData(data) {
    var legendContent = '<div class="legend">';
    data.forEach(function (item) {
        legendContent += '<div class="legend-item">';
        legendContent += '<div class="legend-color" style="background-color:' + item.color + '"></div>';
        legendContent += '<div>' + item.name + '</div>';
        legendContent += '</div>';
    });
    legendContent += '</div>';
    return legendContent;
}

init();

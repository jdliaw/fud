L.mapbox.accessToken = 'pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw';
  var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([32.630395, -117.093245], 10);

myLayer = L.mapbox.featureLayer({
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [
          -117.093245,
          32.630395
        ]
    },
    properties: {
        title: 'Tacos El Gordo',
        description: '689 H Street, Chula Vista, CA 91910',
        'marker-size': 'large',
        'marker-color': '#f75850',
        'marker-symbol': 'restaurant'
    }
}).addTo(map);

var info = document.getElementById('info');

myLayer.on('click',function(e) {
    // Force the popup closed.
    // e.layer.closePopup();

    var feature = e.layer.feature;
    var content = '<div><strong>' + feature.properties.title + '</strong>' +
                  '<p>' + feature.properties.description + '</p></div>';

    info.innerHTML = content;
});

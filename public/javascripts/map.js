L.mapbox.accessToken = 'pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    zoomAnimationThreshold: 9
  }).setView([32.630395, -117.093245], 10);

var zoomFlag = false;

myLayer = L.mapbox.featureLayer({
  type: 'FeatureCollection',
  features: [  
    {
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
    },

    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -117.162116,
          32.87998
        ]
      },
      properties: {
          title: "Rigoberto's Taco Shop",
          description: '7094 Miramar Rd, San Diego, CA 92121',
          'marker-size': 'large',
          'marker-color': '#f75850',
          'marker-symbol': 'restaurant'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -73.988200,
          40.721016
        ]
      },
      properties: {
          title: "La Margarita",
          description: '157 Ludlow Street, New York, NY 10002',
          'marker-size': 'large',
          'marker-color': '#f75850',
          'marker-symbol': 'restaurant'
      }
    },
  ]


}).addTo(map);

var info = document.getElementById('info');

myLayer.on('click',function(e) {
    // Force the popup closed.
    // e.layer.closePopup();

    var feature = e.layer.feature;
    var content = '<div><strong>' + feature.properties.title + '</strong>' +
                  '<p>' + feature.properties.description + '</p></div>';

    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 15);
    info.innerHTML = content;
});


//Changes location to New York.
function changeNY() {
  //If current zoom level is already 6, there won't be a change in zoom aka zoomend...
  if(map.getZoom() === 6) {
     map.setView([40.7150, -73.9843], 6, {
        pan: {
            animate: true,
            duration: 2
        },
        zoom: {
            animate: true,
            duration: 2
        }
    });
  }
  //we want to set the zoom to something small, like 6, so we can properly pan/flyto.
  else {
    map.setZoom(6);
    zoomFlag = true;                                    //zoomflag used to only handle zooms when we click this button.
    map.on("zoomend", zoomHandler);                     //on end of zooming in/out, we'll pan to new york.
  }
}


function zoomHandler(e) {
  console.log(e);
  if(!zoomFlag) {
    return;
  }
  else {
     map.setView([40.7150, -73.9843], 6, {
        pan: {
            animate: true,
            duration: 2
        },
        zoom: {
            animate: true,
            duration: 2
        }
    });
  }
  zoomFlag = false;
}

function changeLA() {

  map.setView([32.630395, -117.093245], 10);
}










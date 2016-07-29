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
  var nyLoc = [40.7150, -73.9843];
  changeLocation(nyLoc);
}

function changeLA() {
  var laLoc = [32.630395, -117.093245];
  changeLocation(laLoc);
}



function changeLocation(destination) {
  var initialZoom = 6;
  if(map.getZoom() === initialZoom) {
     map.setView(destination, initialZoom, {
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
  //small zoom number not zoomed at all.
  else if(map.getZoom() <= initialZoom) {
    map.setView(destination, initialZoom, {
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
  //when very zoomed in, zoom out then pan
  else {
    map.setZoom(initialZoom);
    zoomFlag = true;                                            //zoomflag used to only handle zooms when we click this button.
    map.on("zoomend", function(e) {                             //http://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters || passing in data to event handler function
      zoomHandler.call(this, e, destination, initialZoom);      //Handles zoom and pan
    });
  }  
}


function zoomHandler(e, loc, zoom) {
  if(!zoomFlag) {
    return;
  }
  else {
     map.setView(loc, zoom, {
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






L.mapbox.accessToken = 'pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    zoomAnimationThreshold: 9
  }).setView([32.630395, -117.093245], 10);

//Flags used to determine if the map has finished panning/zooming or not, to make sure we only call event handler functions when we want.
var isFinishedZooming = false;
var isFinishedPanning = false;

//Currently just the locations of NY and LA to pan to.
var nyLoc = [40.7150, -73.9843];
var laLoc = [32.630395, -117.093245];

//tempDest is a variable that's used to hold the actual value of what we wish to pan to, since async functions and event handlers absoltely blow
var tempDest;

//Generating map...
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
//Still generating map...
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
  changeLocation(nyLoc);
}

function changeLA() {
  changeLocation(laLoc);
}

function changeLocation(destination) {
  //What our default zoom will be when we pan animations and stuff.
  var initialZoom = 6;
  tempDest = destination;
  var curZoom = map.getZoom();

  //The case if our current zoom is the same as our default zoom.
  var zoomLevelSameAsDefaultZoom = (curZoom === initialZoom);
  var curZoomSmallerThanDefaultZoom = (curZoom <= initialZoom);
  if(zoomLevelSameAsDefaultZoom) {
     map.setView(destination, initialZoom, {
        pan: {
            animate: true,
            duration: 2
        },
        zoom: {
            animate: true
        }
    });
  }

  //The case if the current zoom is small (very zoomed out)
  else if(curZoomSmallerThanDefaultZoom) {
    zoomOut_PanTo_ZoomIn(destination);
  }
  //The case if the current zoom is large (very zoomed in)
  else {
    map.setZoom(initialZoom);
    isFinishedZooming = true;                                   //zoomflag used to only handle zooms when we click this button.
    map.on("zoomend", function(e) {                             //http://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters || passing in data to event handler function
      panToAfterZoom.call(this, e, destination, initialZoom);      //Handles zoom and pan
    });
  }

}

function zoomOut_PanTo_ZoomIn(destination) {
  //set the view to what we want before changing zoom
  map.setView(destination, map.getZoom(),{
    pan: {
      animate: true,
      duration: 2
    },
    zoom: {
        animate: true,
        duration: 2
    }
  });
  //Now we know that we've finished panning, so we can zoom in
  isFinishedPanning = true;
  //moveend --> can zoom in
  map.on("moveend", function(e) {
    zoomInAfterPan.call(this, e, destination);
  });
}

function zoomInAfterPan(e, destination) {
  if(!isFinishedPanning) {
    return;
  }
  //set zoom levels after panning is finished
  else { 
    map.setZoom(9, {
      zoom: {
        animate: true
      }
    });
  }
  console.log("called");
  isFinishedPanning = false;
}


function panToAfterZoom(e, destination, initialZoom) {
  if(!isFinishedZooming) {
    return;
  }
  //pan to destination after zoom has been set.
  else {
      map.setView(tempDest, initialZoom, {
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
  isFinishedZooming = false;
}

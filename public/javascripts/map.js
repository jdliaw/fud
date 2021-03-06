L.mapbox.accessToken = 'pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw';

//Flags used to determine if the map has finished panning/zooming or not, to make sure we only call event handler functions when we want.
var isFinishedZooming = false;
var isFinishedZoomingAndPanning = false;
var isFinishedPanning = false;

//Currently just the locations of NY and LA to pan to.
var nyLoc = [40.7150, -73.9843];
var laLoc = [34.0689, -118.4452];

//tempDest is a variable that's used to hold the actual value of what we wish to pan to, since async functions and event handlers absoltely blow
//default animation levels
var tempDest;                     //Variable used to get get our destination because of some callback/async/eventhandler issue I can't solve.
var panningZoomLevel = 5;         //What level of zoom we use as our default pan.
var endZoomLevel = 12;            //What level of zoom we use as our default end zoom.
var dur = 2;                      //Duration of pan. Prob will keep as is.
var numRatings = 5;

var map = L.mapbox.map('map', 'mapbox.streets', {
    zoomAnimationThreshold: 9
}).setView([32.630395, -117.093245], 10);

getRestaurants();

function getRestaurants() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.body.className = 'ok';
                //Gets the entire mongodb collection
                var res = JSON.parse(request.responseText);
                //convert mongodb collection to features on map
                var geoJsonData = convertToGeojson(res);
                generateMap(geoJsonData);
            } else {
                document.body.className = 'error';
            }
        }
    };
    var url = getMapdataQueryString();
    request.open("GET", url, true);
    request.send(null);
}


//Generates a url string that looks like this: /rating-input/45/price-input/1234
function getMapdataQueryString() {
    var queryString = "/rating-input/"
    var ratingString = "";
    for (var i = 1; i < numRatings + 1; i++) {
        if ($('#rating-input-' + i).is(":checked")) {
            ratingString += i;
        }
    }
    if(ratingString === "") {
        queryString += "12345";
    }
    else { 
        queryString += ratingString;
    }
    queryString += "/price-input/";
    var priceString = "";
    for (var i = 1; i < numRatings + 1; i++) {
        if ($('#price-input-' + i).is(":checked")) {
            priceString += i;
        }
    }
    if(priceString === "") {
        queryString += "12345";
    }
    else {
        queryString += priceString;
    }

    if(queryString === "/rating-input//price-input/") {
        return "/rating-input/12345/price-input/12345";
    }
    return queryString;
}

function convertToGeojson(res) {
    var jsonData = {};
    jsonData["type"] = "FeatureCollection";
    jsonData["features"] = [];

    var features = {};

    for (var prop in res) {
        if (!res.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }
        var title = res[prop]["title"];
        var addr = res[prop]["address"];
        var lat = res[prop]["location"].lat;
        var lon = res[prop]["location"].lng;
        var featureData = {};

        var feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "title": title,
                "description": addr,
                "marker-size": "large",
                "marker-color": "#f75850",
                "marker-symbol": "restaurant"
            }
        }
        jsonData["features"][prop] = feature;
    }
    return jsonData;
}
var myLayer;
function generateMap(geoJsonData) {
    //Generating map...
    //remove to create. 
    if (myLayer instanceof L.mapbox.FeatureLayer) {
        myLayer.clearLayers();
        myLayer = L.mapbox.featureLayer(geoJsonData).addTo(map);
    } else {
        myLayer = L.mapbox.featureLayer(geoJsonData).addTo(map);
    }

    //Still generating map...
    myLayer.on('click', function (e) {
        // Force the popup closed.
        // e.layer.closePopup();

        var feature = e.layer.feature;
        var content = '<div><strong>' + feature.properties.title + '</strong>' +
            '<p>' + feature.properties.description + '</p></div>';

        showReview(feature.properties.title);

        var dest = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        map.setView(dest, 15);
    });
}

/************************************************************/
/*                                                          */
/*  All stuff used to move the map smoothly. Nothing else.  */
/*                                                          */
/************************************************************/

function searchRestaurants() {
    showSubNav();
}

//Changes location to New York.
function changeNY() {
    changeLocation(nyLoc);
}

//Changes location to Los Angeles.
function changeLA() {
    changeLocation(laLoc);
}

/*Function called to change location to a different city. This is essentially equivalent to a janky version of flyTo() from mapbox gl js. */
function changeLocation(destination) {

    var distanceToDestination = getDistance(destination);

    setAnimationVars(distanceToDestination);

    //What our default zoom will be when we pan animations and stuff.
    tempDest = destination;
    var curZoom = map.getZoom();

    //The case if the current zoom level is less than or equal to default zoom. That is, the view is quite zoomed out.
    var isCurrentlyVeryZoomedOut = (curZoom <= panningZoomLevel);
    if (isCurrentlyVeryZoomedOut) {
        //zoomed out -> pan to -> zoom in
        zoomedOut_PanTo_ZoomIn(tempDest);
    }
    //The case if the current zoom is large (very zoomed in)
    else {
        //zoomed in -> zoom out -> panTo -> zoom in
        zoomedIn_ZoomOut_PanTo_ZoomIn();
    }
}

/* This function is called when we are currently zoomed in. First it zooms out, then it pans to location. Calls a zoom in function after. */
function zoomedIn_ZoomOut_PanTo_ZoomIn() {
    map.setZoom(panningZoomLevel);
    isFinishedZooming = true;                                   //zoomflag used to only handle zooms when we click this button.
    isFinishedZoomingAndPanning = false;                        //flag also used to check if done zooming and panning
    map.on("zoomend", function (e) {                             //http://stackoverflow.com/questions/10000083/javascript-event-handler-with-parameters || passing in data to event handler function
        panToAfterZoom.call(this, e, tempDest, panningZoomLevel); //Handles zoom and pan
        isFinishedZoomingAndPanning = true;
    });

    thenZoomIn();
}

//Call this function after we zoom out, panTo location, then want to zoom in. (Fly to) Must timeout a certain time b/c asynchronous reasons.
function thenZoomIn() {
    //Wait until the we are done zooming and panning. Need the timeout because it's in response to something that is already an event handler function.
    if (!isFinishedZoomingAndPanning) {
        setTimeout(thenZoomIn, 2350);
    }
    //Now that we've waited, we can pan!
    else {
        map.setZoom(endZoomLevel);
    }
}

/*
  Function is called when zoom is greater than or equal to default zoom.
  First pan to our destination, when done panning, then zoom in.
*/
function zoomedOut_PanTo_ZoomIn() {
    //set the view to what we want before changing zoom
    setMapView(tempDest, map.getZoom());

    //Now we know that we've finished panning, so we can zoom in
    isFinishedPanning = true;
    map.on("moveend", function (e) {
        zoomInAfterPan.call(this, e, tempDest);
    });
}

/*Event handler to zoom in after we pan*/
function zoomInAfterPan(e, destination) {
    if (!isFinishedPanning) {
        return;
    }
    //set zoom levels after panning is finished
    else {
        map.setZoom(endZoomLevel);
    }
    isFinishedPanning = false;
}

/* Function that is called to pan to a location after zooming (out)*/
function panToAfterZoom(e, destination, initialZoom) {
    if (!isFinishedZooming) {
        return;
    }
    //pan to destination after zoom has been set.
    else {
        setMapView(tempDest, initialZoom);
    }
    isFinishedZooming = false;
}

//function to set map view with panning animation.
function setMapView(destination, zoom) {
    map.setView(destination, zoom, {
        pan: {
            animate: true,
            duration: dur
        },
        zoom: {
            animate: true,
        }
    });
}

function getDistance(destination) {
    var ctr = map.getCenter();
    var dest = destination;
    var latDiff = dest[0] - ctr.lat;
    var lngDiff = dest[1] - ctr.lng;
    var distance = Math.sqrt((latDiff * latDiff) + (lngDiff * lngDiff));
    return distance;
}

function setAnimationVars(distanceToDestination) {
    if (distanceToDestination < 1.5) {
        panningZoomLevel = 10;
    }
    else if (distanceToDestination < 5) {
        panningZoomLevel = 8;
    }
    else {
        panningZoomLevel = 6;
    }
}
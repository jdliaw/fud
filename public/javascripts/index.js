L.mapbox.accessToken = 'pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw';
  var bigMap = L.mapbox.map('big-map', 'mapbox.streets', {zoomControl: false})
      .setView([32.630395, -117.093245], 2);

bigMap.dragging.disable();
bigMap.touchZoom.disable();
bigMap.doubleClickZoom.disable();
bigMap.scrollWheelZoom.disable();
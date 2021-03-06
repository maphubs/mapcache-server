var L = require('leaflet');
var turf = require('turf');

module.exports = function LeafletCacheController($scope, $element, LocalStorageService, LeafletUtilities) {

  var baseLayerOptions = $scope.options || {
    maxZoom: 18,
    tms: false,
    opacity: 1
  };

  var cacheLayerOptions = {
    maxZoom: 18,
    tms: false,
    opacity: 1
  };
  var map = null;

  var defaultLayer = baseLayerOptions.baseLayerUrl;

  var baseLayer = L.tileLayer(defaultLayer, baseLayerOptions);
  var cacheLayer = null;

  $scope.$watch('cache', function(cache) {
    if (map) return;
    if (!cache) return;
    map = L.map($element[0], {
      center: [45,0],
      zoom: 3,
      minZoom: cache.source.vector ? 0 : cache.minZoom,
      maxZoom: cache.source.vector ? 18 : cache.maxZoom
    });
    map.addControl(new L.Control.ZoomIndicator());
    if (cache.vector) {
      baseLayer.setOpacity(1);
    }

    baseLayer.addTo(map);
    cacheLayerOptions.tms = 'tms' === cache.source.format;
    cacheLayerOptions.maxZoom = cache.source.vector ? 18 : cache.maxZoom;
    cacheLayerOptions.minZoom = cache.source.vector ? 0 : cache.minZoom;
    if (cacheLayer) {
      map.removeLayer(cacheLayer);
    }
    cacheLayer = LeafletUtilities.tileLayer(cache, defaultLayer, cacheLayerOptions, cache.style, styleFunction);
    if (cacheLayer) {
      cacheLayer.addTo(map);
    }
    var extent = turf.extent(cache.geometry);
    map.fitBounds([
      [extent[1],extent[0]],
      [extent[3], extent[2]]
    ]);

  });

  function styleFunction(feature) {
    return LeafletUtilities.styleFunction(feature, $scope.cache.style);
  }
};

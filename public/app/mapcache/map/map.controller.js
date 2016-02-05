var _ = require('underscore');

module.exports = function MapController($scope, $location, $timeout, $routeParams, $rootScope, $filter, CacheService, MapService, LocalStorageService) {

  $scope.token = LocalStorageService.getToken();
  $scope.mapOptions = {
    baseLayerUrl: 'http://mapbox.geointapps.org:2999/v4/mapbox.light/{z}/{x}/{y}.png',
    opacity: 0.14
  };

  $rootScope.title = 'Map';
  $scope.map = {
    id: $routeParams.mapId
  };

  var cacheHighlightPromise;
  $scope.mouseOver = function(cache) {
    $rootScope.$broadcast('showCacheExtent', cache);
    if (cacheHighlightPromise) {
      $timeout.cancel(cacheHighlightPromise);
    }
    cacheHighlightPromise = $timeout(function() {
      $rootScope.$broadcast('showCache', cache);
    }, 500);
  };

  $scope.mouseOut = function(cache) {
    $rootScope.$broadcast('hideCacheExtent', cache);

    if (cacheHighlightPromise) {
      $timeout.cancel(cacheHighlightPromise);
      cacheHighlightPromise = undefined;
    }
    $rootScope.$broadcast('hideCache', cache);
  };

  var allCaches;

  $scope.createCacheFromMap = function() {
    $location.path('/create/'+$routeParams.mapId);
  };

  $scope.$on('cacheFilterChange', function(event, filter) {
    $scope.caches = $filter('filter')($filter('filter')(allCaches, filter.cacheFilter), filter.mapFilter);
  });

  $scope.$on('generateFormat', function(event, cache, format) {
    CacheService.createCacheFormat(cache, format, function() {
      cache.formats = cache.formats || {};
      cache.formats[format] = cache.formats[format] || {};
      cache.formats[format].generating = true;
      getCaches();
    });
  });

  function getCaches() {
    MapService.getCachesForMap($scope.map, function(caches) {
      allCaches = caches;
      $scope.caches = caches;

      var currentlyGenerating = false;
      for (var i = 0; i < caches.length && !currentlyGenerating; i++) {
        var cache = caches[i];
        if (!cache.status.complete) {
          currentlyGenerating = true;
        }
        for (var format in cache.formats) {
          if(cache.formats.hasOwnProperty(format)){
            if (!cache.formats[format].complete) {
              currentlyGenerating = true;
            }
          }
        }
      }
      var delay = currentlyGenerating ? 30000 : 300000;
      $timeout(getCaches, delay);

    });
  }

  $scope.mapComplete = false;

  function getMap() {
    MapService.refreshMap($scope.map, function(map) {
      // success
      $scope.map = map;
      $rootScope.title = map.name;
      if (_.some(map.dataSources, function(value) {
        return !value.status.complete; })) {
        $scope.mapComplete = false;
        $timeout(getMap, 5000);
      } else {
        $scope.mapComplete = true;
        getCaches();
        if (map.vector) {
          $scope.mapOptions.opacity = 1;
          $scope.map.style = $scope.map.style || {styles:[], defaultStyle: {style: {}}};
        }
      }
    }, function() {
      // error
    });
  }

  getMap();
};

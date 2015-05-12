angular
  .module('mapcache')
  .controller('MapcacheSourceCreateController', MapcacheSourceCreateController);

MapcacheSourceCreateController.$inject = [
  '$scope',
  '$location',
  '$timeout',
  '$http',
  'CacheService',
  'SourceService'
];

function MapcacheSourceCreateController($scope, $location, $timeout, $http, CacheService, SourceService) {

  $scope.source = {
    format: 'xyz'
  };

  var uploadProgress = function(e) {
    if(e.lengthComputable){
      $scope.$apply(function() {
        $scope.progress = (e.loaded/e.total) * 100;
        console.log('uploadprogress ' + $scope.progress);
      });
    }
  }

  function pruneSource(s) {
    var source = angular.copy(s);
    delete source.previewLayer;
    delete source.wmsGetCapabilities;
    return source;
  }

  $scope.createSource = function() {
    console.log($scope.cache);
    $scope.sourceSubmitted = true;
    var sourceSubmit = pruneSource($scope.source);
    SourceService.createSource(sourceSubmit, function(source) {
      console.log('source created', source);
      // now start a timer to watch the source be created
      $location.path('/source/'+source.id);
    }, function() {
      console.log("error");
    }, uploadProgress);
  }

  $scope.$on('uploadFile', function(e, uploadFile) {
    console.log(uploadFile);
    $scope.source.sourceFile = uploadFile;
  });

  function getSourceProgress() {
    SourceService.refreshSource($scope.source, function(source) {
      // success
      $scope.source = source;
      if (!source.complete) {
        $timeout(getSourceProgress, 5000);
      }
    }, function(data) {
      // error
    });
  }

  $scope.$watch('source.url', function(url) {
    if (!url) { return; }
    if ($scope.source.format == 'wms') {
      $scope.source.wmsGetCapabilities = null;
      $scope.fetchingCapabilities = true;
      $http.get('/api/sources/wmsFeatureRequest',
      {
        params: {
          wmsUrl: url
        }
      }).success(function (data) {
        $scope.fetchingCapabilities = false;
        $scope.source.wmsGetCapabilities = data;
      });
    }
  });

};

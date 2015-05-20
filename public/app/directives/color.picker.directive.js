angular
  .module('mapcache')
  .directive('colorPicker', colorPicker);

function colorPicker() {
  var directive = {
    restrict: "A",
    scope: {
      colorPicker: '='
    },
    controller: ColorPickerController
  };

  return directive;
}

ColorPickerController.$inject = ['$scope', '$element'];

function ColorPickerController($scope, $element) {

  $scope.$watch('colorPicker', initialize);

  function initialize() {
    console.log('color picker', $scope.colorPicker);
    if (!$scope.colorPicker) return;
    $element.colorpicker({color: $scope.colorPicker}).on('changeColor.colorpicker', function(event){
      $scope.$apply(function() {
        $scope.colorPicker = event.color.toHex();
      });
    });
  }

  initialize();
}

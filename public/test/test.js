window.jQuery = require("jquery");
var angular = require('angular');
require('angular-mocks');
require('angular-route');
require('../app/auth/http-auth-interceptor');
require('angular-ui-bootstrap');
// putting this  because you have to build it before you can use it
require('../vendor/angular_ui_select');
require('angular-sanitize');

angular.module('ngTemplates',[]);


// fix the image path
var L = require('leaflet');
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

angular.module('mapcache', [ 'ngRoute', 'ngSanitize', 'http-auth-interceptor', 'ui.bootstrap', 'ui.select', 'ngTemplates']).config(function($routeProvider) {

  $routeProvider.when('/map/:mapId/edit', {
    templateUrl:    'app/mapcache/map/map-edit.html',
    // template : 'welcome to {{ title }}',
    controller:     "MapEditController"
  });
});

describe('mapcache browser tests', function() {

  beforeEach(angular.mock.module('mapcache'));

  before(function(){

    require('../app/signin');
    require('../app/factories');
    require('../app/filters');
    require('../app/mapcache');
    require('../app/admin/storage');
    require('../app/user');
    require('../app/about');
    require('../app/directives');
  });

  it('should have created the module', function(){

  });
});


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.be.equal(-1);
      [1,2,3].indexOf(0).should.be.equal(-1);
    });
  });
});

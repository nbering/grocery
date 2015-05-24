// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

/* global cordova */
angular.module('grocery', ['ionic', 'ngCordova'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'BarcodeController'
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(false);
})
.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(){
     console.log('$stateChangeStart');
  });

  $rootScope.$on('$stateChangeSuccess', function(){
      console.log('$stateChangeSuccess');
  });
  $rootScope.$on('$stateChangeError', function(){
      console.log('$stateChangeError');
  });
  $rootScope.$on('$stateNotFound', function(){
      console.log('$stateNotFound');
  });
  $rootScope.$on('$viewContentLoading', function(event, viewConfig){
      console.log('$viewContentLoading', {event:event, viewConfig:viewConfig});
  });
  $rootScope.$on('$viewContentLoaded', function(){
      console.log('$viewContentLoaded');
  });
}).controller('BarcodeController',function($scope,$cordovaBarcodeScanner){
    $scope.barcodes = [];
    $scope.scanBarcode = function(){
        $cordovaBarcodeScanner.scan().then(function(data){
            $scope.barcodes.push(data);
        });
    };
});

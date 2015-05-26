/* global cordova */
(function(){
    angular.module('grocery', ['ionic', 'ngCordova'])
        .config(configRoutes)
        .run(logStateChanges);

    function configRoutes($stateProvider, $urlRouterProvider, $locationProvider){
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        })
        .state('add-department',{
            url: '/add-department',
            templateUrl: 'partials/add-department.html',
            controller: 'AddDepartmentController'
        })
        .state('department-list', {
            url: '/department-list',
            templateUrl: 'partials/department-list.html',
            controller: 'DepartmentListController'
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(false);
    }

    function logStateChanges($ionicPlatform, $rootScope) {
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
    }
})();

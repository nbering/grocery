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

(function(){
	angular.module('grocery')
		.controller('AddDepartmentController', AddDepartmentController);
		
	AddDepartmentController.$inject = ['$scope', '$state', '$log', 'groceryRepository'];
	
	function AddDepartmentController($scope, $state, $log, groceryRepository){
		$scope.form={name:''};
		
		$scope.saveDepartment = saveDepartment;
		
		function saveDepartment(department){
			groceryRepository.addDepartment(department)
				.then(addDepartmentSuccess, addDepartmentError);
		}		
		
		function addDepartmentSuccess(id){
			$log.info('AddDepartmentController.addDepartmentSucces(id) -> ', id);
			$state.go('home');
		}
		
		function addDepartmentError(err){
			$state.go('home');
		}
	}
})();
/* global angular */
(function(){
	angular.module('grocery')
		.controller('DepartmentListController', DepartmentListController);
		
		DepartmentListController.$inject = ['$scope', 'groceryRepository'];
		
		function DepartmentListController($scope, groceryRepository){
			$scope.departments = [];
			
			$scope.deleteDepartment = deleteDepartment;
			
			init();
			
			function init(){
				groceryRepository.getDepartments().then(getDepartmentsSuccess);
			}
			
			function getDepartmentsSuccess(result){
				$scope.departments = result;
			}
			
			function deleteDepartment(id){
				groceryRepository.deleteDepartment(id).then(function(){
					for (var i=0; i<$scope.departments.length; i++){
						if ($scope.departments[i].id === id){
							$scope.departments.splice(i,1);
							break;
						}
					}
				});
			}
		}
})();
/* global angular */
(function(){
	angular.module('grocery')
		.factory('groceryRepository', groceryRepositoryFactory);
	
	groceryRepositoryFactory.$inject = ['$cordovaSQLite', '$ionicPlatform', '$q', '$log'];
		
	function groceryRepositoryFactory($cordovaSQLite, $ionicPlatform, $q, $log){
		var groceryRepository = {};
		groceryRepository.database = null;
		groceryRepository.addDepartment = addDepartment;
		groceryRepository.getDepartments = getDepartments;
		groceryRepository.getDepartment = getDepartment;
		groceryRepository.updateDepartment = updateDepartment;
		groceryRepository.deleteDepartment = deleteDepartment;
		
		init();
		
		//THE FOLD
		
		function init(){
			$ionicPlatform.ready(initDb);
		}
		
		function initDb(){
			groceryRepository.database = $cordovaSQLite.openDB("grocery.db");
			groceryRepository.database.transaction(setupDatabase);
		}
		
		function setupDatabase(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS departments (id integer primary key, name text)');
		}
		
		function addDepartment(department){
			var deferred = $q.defer();
			
			var query = 'INSERT INTO departments (name) VALUES (?)';
			var params = [department.name];
			
			$ionicPlatform.ready(function(){
				$cordovaSQLite.execute(groceryRepository.database, query, params)
					.then(addDepartmentCallback,addDepartmentError);
			});
			
			function addDepartmentCallback(res){
				$log.info("Add Department Success -> ", res);
				deferred.resolve(res.insertId);
			}
			
			function addDepartmentError(err){
				$log.error("Error: Failed to add department to database in groceryRepository.addDepartment().  Inner Error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		function getDepartments(){
			var deferred = $q.defer();
			var query = 'SELECT * FROM departments ORDER BY name';
			var params = [];
			$ionicPlatform.ready(function(){
				$cordovaSQLite.execute(groceryRepository.database, query, params)
					.then(getDepartmentsSuccess, getDepartmentsError);	
			});			
			function getDepartmentsSuccess(res){
				$log.info("Get Departments Success -> ", res);
				var result = [];
				for (var i = 0; i < res.rows.length; i++){
					result.push(res.rows.item(i));				
				}
				deferred.resolve(result);
			}
			
			function getDepartmentsError(err){
				$log.error("Error: Failed to get departments from database in groceryRespository.getDepartments(). Inner error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		function getDepartment(id){
			var deferred = $q.defer();
			var query = 'SELECT * FROM departments WHERE id = ? LIMIT 1';
			var params = [id];
			
			$ionicPlatform.ready(function(){
			$cordovaSQLite.execute(groceryRepository.database, query, params)
				.then(getDepartmentSucces, getDepartmentFail);
			});
			
			function getDepartmentSucces(res){
				$log.info("Got a department.", res);
				deferred.resolve(res.rows.item(0));
			}
			
			function getDepartmentFail(err){
				$log.error("Error: Failed to get department from database in groceryRepository.getDepartment(). Inner error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		function updateDepartment(department){
			var deferred = $q.defer();
			var query = 'UPDATE departments SET name = ? WHERE id = ?';
			var params = [department.name, department.id];
			
			$ionicPlatform.ready(function(){
				$cordovaSQLite.execute(groceryRepository.database, query, params)
					.then(updateDepartmentSuccess, updateDepartmentFail);
			});
			
			function updateDepartmentSuccess(res){
				deferred.resolve();
			}
			
			function updateDepartmentFail(err){
				$log.error("Error: Failed to update department in database at groceryRepository.updateDepartment().  Inner error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		function deleteDepartment(id){
			var deferred = $q.defer();
			var query = 'DELETE FROM departments WHERE id = ?';
			var params = [id];
			
			$ionicPlatform.ready(function(){
			$cordovaSQLite.execute(groceryRepository.database, query, params)
				.then(deleteDepartmentSuccess, deleteDepartmentFail);
			});
			
			function deleteDepartmentSuccess(rest){
				deferred.resolve();
			}
			
			function deleteDepartmentFail(err){
				$log.error("Error: Failed to delete department from database at groceryRepository.deleteDepartment(id). Inner error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		return groceryRepository;
	}	
})();
/* global cordova */
(function(){
    angular.module('grocery')
        .controller('HomeController', HomeController);

    function HomeController($scope,$cordovaBarcodeScanner){
        $scope.barcodes = [];
        $scope.scanBarcode = scanBarcode;

        function scanBarcode(){
            $cordovaBarcodeScanner.scan().then(scanSuccess);
        }

        function scanSuccess(data){
            if (!data.cancelled){
                $scope.barcodes.push(data);
            }
        }
    }
})();

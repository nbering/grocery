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
		
		init();
		
		//THE FOLD
		
		function init(){
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
			
			$cordovaSQLite.execute(groceryRepository.database, query, params)
				.then(addDepartmentCallback,addDepartmentError);
			
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
			
			$cordovaSQLite.execute(groceryRepository.database, query)
				.then(getDepartmentsSuccess, getDepartmentsError);
			
			function getDepartmentsSuccess(res){
				$log.info("Get Departments Success -> ", res);
				deferred.resolve(res.rows);
			}
			
			function getDepartmentsError(err){
				$log.error("Error: Failed to get departments from database in groceryRespository.getDepartments(). Inner error -> ", err);
				deferred.reject(err);
			}
			
			return deferred.promise;
		}
		
		return groceryRepository;
	}	
})();
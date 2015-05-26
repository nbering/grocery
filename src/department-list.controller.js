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
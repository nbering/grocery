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
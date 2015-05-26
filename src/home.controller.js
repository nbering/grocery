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

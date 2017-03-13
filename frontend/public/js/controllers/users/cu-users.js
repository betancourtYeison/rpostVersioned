(function() {
    angular.module('rposts.controllers')
        .controller('UsersCUController', ['$rootScope', '$scope', '$location', '$window', '$timeout', '$uibModal', '$uibModalInstance', 'ENV', 'usersService', function($rootScope, $scope, $location, $window, $timeout, $uibModal, $uibModalInstance, ENV, usersService) {
            /**
             * @desc function to handle charcode by enter
             * @param event $event
             */
            var onKeyPressSeller = function(event) {
                if ($scope.formConfigModal) {
                    if ((event.charCode === 13) && (!$scope.formConfigModal.$invalid) && !$scope.NotValidForm()) {
                        $scope.saveUser();
                    }
                }
            };
            /**
             * @desc function to add event Listener
             */
            document.addEventListener('keypress', onKeyPressSeller);
            /**
             * @desc function to call create or update function in UsersSellerController controller
             */
            $scope.saveUser = function() {
                document.removeEventListener('keypress', onKeyPressSeller);
                if ($scope.eventType == 'create') {
                    $scope.createUser($scope.user, $uibModalInstance);
                } else {
                    $scope.updateUser($scope.user, $uibModalInstance);
                }
            };
            /**
             * @desc function to close modal
             */
            $scope.cancel = function() {
                $uibModalInstance.dismiss();
            };
        }]);
})();

(function() {
    angular.module('rposts.controllers')
        .controller('SessionController', ['$rootScope', '$scope', '$location', '$uibModal', '$route', '$timeout', 'sessionService', function($rootScope, $scope, $location, $uibModal, $route, $timeout, sessionService) {
            $scope.currentUser = $rootScope.currentUser;
            $scope.loginData = sessionService.getLoginFormData() || {};
            /* ngProgress Instance */
            $scope.errors = undefined;

            $scope.signIn = function() {
                var $myScope = $scope;
                sessionService.signIn(this.loginData).then(function(data) {

                    var continueSignIn = function() {
                        try {
                            var url = $route.current.params.url.replace(/\(-\)/g, '/');
                            $location.path(url);
                        } catch (e) {
                            $location.path('/');
                        }
                    };

                    if (sessionService.existsLoginData($scope.loginData)) {
                        sessionService.saveLoginFormData($scope.loginData); //update it as last loginData saved
                        continueSignIn();
                    } else if (!sessionService.existsInNeverSaveLoginFormData($scope.loginData)) {
                        $uibModal.open({
                            templateUrl: 'views/session/partials/confirm-save-login-data-modal.html',
                            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                                var onKeyPress = function(event) {
                                    if (event.charCode === 13) { $scope.save(); }
                                };

                                document.addEventListener('keypress', onKeyPress);

                                $scope.save = function() {
                                    document.removeEventListener('keypress', onKeyPress);
                                    $uibModalInstance.close();
                                };
                                $scope.notSaveNow = function() {
                                    document.removeEventListener('keypress', onKeyPress);
                                    $uibModalInstance.dismiss();
                                };

                                $scope.neverSave = function() {
                                    document.removeEventListener('keypress', onKeyPress);
                                    sessionService.neverSaveLoginFormData($myScope.loginData);
                                    $uibModalInstance.dismiss();
                                };

                            }],
                            backdrop: 'static'
                        }).result.then(function() {
                            sessionService.saveLoginFormData($scope.loginData);
                            continueSignIn();
                        }, function() {
                            continueSignIn();
                        });
                    } else {
                        continueSignIn();
                    }
                }, function(reason) {
                    if (typeof(reason) === "string") {
                        $scope.errors = reason;
                        $timeout(function() {
                            $scope.errors = null;
                        }, 5000);
                    }
                });
            };
        }]);
})();

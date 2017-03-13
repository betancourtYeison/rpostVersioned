(function() {
    angular.module('rposts.controllers')
        .controller('UsersController', ['$rootScope', '$scope', '$uibModal', '$filter', '$timeout', 'usersService', 'dashboardService', function($rootScope, $scope, $uibModal, $filter, $timeout, usersService, dashboardService) {

            $scope.ordenSelected = 'username';
            $scope.response = null;
            $scope.errors = null;
            $scope.postsByUser = [];

            $scope.getUsers = function() {
                usersService.getUsers().then(function(data) {
                    $scope.users = data;
                }, function(reason) {
                    $scope.errors = reason;
                    $timeout(function() {
                        $scope.errors = null;
                    }, 3000);
                });
            }

            $scope.getUsers();

            $scope.getPosts = function() {
                dashboardService.getPosts().then(function(data) {
                    $scope.posts = data;
                }, function(reason) {});
            }

            $scope.getPosts();

            $scope.showPostByUser = function(username) {
                $scope.postsByUser = $scope.posts.filter(function(obj) {
                    return obj.user.username == username;
                });
            }

            $scope.createUser = function(user, uibModalInstance) {
                usersService.createUser(user)
                    .then(function(response) {
                        $scope.response = response;
                        $scope.getUsers();
                        $timeout(function() {
                            uibModalInstance.close();
                            $scope.response = null;
                        }, 3000);
                    }, function(reason) {
                        $scope.errors = reason;
                        $timeout(function() {
                            $scope.errors = null;
                        }, 3000);
                    });
            }

            $scope.openModelCreateUser = function() {
                $scope.title = 'Crear Usuario';
                $scope.eventType = 'create';

                $scope.user = {
                    username: null,
                    password: null,
                    first_name: null,
                    last_name: null,
                    email: null,
                    can_create_posts: {
                        options: [
                            'ACTIVO',
                            'INACTIVO',
                        ],
                        selected: 'ACTIVO'
                    }
                }

                $uibModal.open({
                    templateUrl: 'views/users/partials/create-and-update.html',
                    scope: $scope,
                    size: 'md',
                    windowClass: 'u-modal-sm',
                    controller: 'UsersCUController',
                    backdrop: 'static'
                }).result.then(function() {}, function() {});
            }

            $scope.updateUser = function(user, uibModalInstance) {
                usersService.updateUser(user)
                    .then(function(response) {
                        $scope.response = response;
                        $scope.getUsers();
                        $timeout(function() {
                            uibModalInstance.close();
                            $scope.response = null;
                        }, 3000);
                    }, function(reason) {
                        $scope.errors = reason;
                        $timeout(function() {
                            $scope.errors = null;
                        }, 3000);
                    });
            }

            $scope.openModelUpdateUser = function(user) {
                $scope.title = 'Actualizar Usuario'
                $scope.eventType = 'update';

                $scope.user = {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    can_create_posts: {
                        options: [
                            'ACTIVO',
                            'INACTIVO',
                        ],
                        selected: user.can_create_posts ? 'ACTIVO' : 'INACTIVO'
                    }
                }

                $uibModal.open({
                    templateUrl: 'views/users/partials/create-and-update.html',
                    scope: $scope,
                    size: 'md',
                    windowClass: 'u-modal-sm',
                    controller: 'UsersCUController',
                    backdrop: 'static'
                }).result.then(function() {}, function() {});
            }

            $scope.deleteUser = function(user, uibModalInstance) {
                usersService.deleteUser(user)
                    .then(function(response) {
                        $scope.response = response;
                        $scope.getUsers();
                        $timeout(function() {
                            uibModalInstance.close();
                            $scope.response = null;
                        }, 3000);
                    }, function(reason) {
                        $scope.errors = reason;
                        $timeout(function() {
                            $scope.errors = null;
                        }, 3000);
                    });
            }

            $scope.openModelDeleteUser = function(user) {
                $uibModal.open({
                    templateUrl: 'views/partials/verify-action/verify-action.html',
                    scope: $scope,
                    controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                        $scope.title = 'Eliminar usuario';
                        $scope.body = '¿Realmente desea eliminar el usuario <u>' + $filter('uppercase')(user.username) + '</u>?';

                        var onKeyPress = function(event) {
                            if (event.charCode === 13) { $scope.ok(); }
                        };

                        document.addEventListener('keypress', onKeyPress);

                        $scope.ok = function() {
                            document.removeEventListener('keypress', onKeyPress);
                            $scope.deleteUser(user, $uibModalInstance)
                        };

                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        };
                    }],
                    backdrop: 'static'
                }).result.then(function() {}, function() {});
            }

            $scope.orderBy = function() {
                $scope.ordenSelected = ($scope.ordenSelected === 'username') ? '-username' : 'username';
            };

        }]);
})();

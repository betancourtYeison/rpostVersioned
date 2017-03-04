(function() {
    angular.module('rposts.controllers')
        .controller('DashboardController', ['$rootScope', '$scope', '$timeout', 'dashboardService', function($rootScope, $scope, $timeout, dashboardService) {

            $scope.response = null;
            $scope.errors = null;

            $scope.getPosts = function() {
                dashboardService.getPosts().then(function(data) {
                    $scope.posts = data;
                }, function(reason) {
                    $scope.errors = reason;
                    $timeout(function() {
                        $scope.errors = null;
                    }, 3000);
                });
            }

            $scope.getPosts();

            $scope.createPost = function(post) {
                dashboardService.createPost(post)
                    .then(function(response) {
                        $scope.response = response;
                        $scope.getPosts();
                        $timeout(function() {
                            $scope.post = null;
                            $scope.response = null;
                        }, 3000);
                    }, function(reason) {
                        $scope.errors = reason;
                        $timeout(function() {
                            $scope.errors = null;
                        }, 3000);
                    });
            }

        }]);
})();

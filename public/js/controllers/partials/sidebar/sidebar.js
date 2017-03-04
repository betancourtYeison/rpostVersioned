(function() {
    angular.module('rposts.controllers')
        .controller('SidebarController', ['$rootScope', '$scope', '$location', 'sessionService', function($rootScope, $scope, $location, sessionService) {
            $scope.location = $location;

            $scope.openModule = function(urlName) {
                $location.path($rootScope.appUrls[urlName]);
            };

            $scope.isActive = function(urlName) {
                return $location.path() === $rootScope.appUrls[urlName];
            };

            $scope.logout = function(){
                sessionService.signOut().then(function(data) {
                    if(data){
                        $location.path($rootScope.appUrls['login']);
                    }
                }, function(reason) {});
            }
        }]);
})();

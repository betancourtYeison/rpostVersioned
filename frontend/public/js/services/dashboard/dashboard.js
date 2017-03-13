(function() {
    angular.module('rposts.services')
        .factory('dashboardService', ['$rootScope', 'config', '$http', '$q', function($rootScope, config, $http, $q) {
            var me = this;

            var getPosts = function() {
                var deferred = $q.defer(),
                    report = '/posts/list/';

                $http({
                        method: 'GET',
                        url: config.BASEURL + report,
                        timeout: 60000
                    })
                    .then(function successCallback(response) {
                        if (!response.data.errors) {
                            deferred.resolve(response.data.posts);
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });

                return deferred.promise;
            };

            var createPost = function(data) {
                var deferred = $q.defer(),
                    report = '/posts/create/';

                var data = {
                    csrfmiddlewaretoken: $rootScope.currentUser.csrftoken,
                    title: data.title,
                    message: data.message
                }

                $http({
                        method: 'POST',
                        url: config.BASEURL + report,
                        data: data,
                        timeout: 180000
                    })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            deferred.resolve('Se ha creado el post satisfactoriamente.');
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });
                return deferred.promise;
            };

            return {
                getPosts: getPosts,
                createPost: createPost
            };
        }]);
})();

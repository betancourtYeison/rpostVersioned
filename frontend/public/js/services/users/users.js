(function() {
    angular.module('rposts.services')
        .factory('usersService', ['$rootScope', 'config', '$http', '$q', '$window', '$filter', 'ipCookie', function($rootScope, config, $http, $q, $window, $filter, ipCookie) {
            var me = this;

            var getUsers = function() {
                var deferred = $q.defer(),
                    report = '/users/list/';

                $http({
                        method: 'GET',
                        url: config.BASEURL + report,
                        params: {},
                        timeout: 60000
                    })
                    .then(function successCallback(response) {
                        if (!response.data.errors) {
                            deferred.resolve(response.data.users);
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });

                return deferred.promise;
            };

            var createUser = function(data) {
                var deferred = $q.defer(),
                    report = '/users/create/';

                var data = {
                    csrfmiddlewaretoken: $rootScope.currentUser.csrftoken,
                    username: data.username,
                    password: data.password,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    can_create_posts: data.can_create_posts.selected === 'ACTIVO' ? true : false
                };

                $http({
                        method: 'POST',
                        url: config.BASEURL + report,
                        data: data,
                        timeout: 180000
                    })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            deferred.resolve('Se ha creado el usuario satisfactoriamente.');
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });
                return deferred.promise;
            };

            var updateUser = function(data) {
                var deferred = $q.defer(),
                    report = '/users/update/' + data.id + '/';

                var data = {
                    csrfmiddlewaretoken: $rootScope.currentUser.csrftoken,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    can_create_posts: data.can_create_posts.selected === 'ACTIVO' ? 'Y' : 'N'
                };

                $http({
                        method: 'POST',
                        url: config.BASEURL + report,
                        data: data,
                        timeout: 180000
                    })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            deferred.resolve('Se ha actualizado el usuario satisfactoriamente.');
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });
                return deferred.promise;
            };

            var deleteUser = function(data) {
                var deferred = $q.defer(),
                    report = '/users/delete/' + data.id + '/';

                var params = {
                    csrfmiddlewaretoken: $rootScope.currentUser.csrftoken
                }

                $http({
                        method: 'POST',
                        url: config.BASEURL + report,
                        data: params,
                        timeout: 180000
                    })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            deferred.resolve('Se ha eliminado el usuario satisfactoriamente.');
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('No se ha podido tramitar la solicitud en este momento, por favor vuelva a intentarlo. Detalle: ' + response);
                    });
                return deferred.promise;
            };

            return {
                getUsers: getUsers,
                createUser: createUser,
                updateUser: updateUser,
                deleteUser: deleteUser
            };
        }]);
})();

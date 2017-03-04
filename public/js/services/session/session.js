(function() {
    angular.module('rposts.services')
        .factory('sessionService', ['$rootScope', 'config', '$http', '$q', '$window', '$filter', 'ipCookie', function($rootScope, config, $http, $q, $window, $filter, ipCookie) {
            var me = this;

            var getCurrentUser = function(currentUser) {
                var currentUser = window.sessionStorage.getItem('currentUser');
                currentUser = (currentUser) ? JSON.parse(currentUser) : currentUser;
                return currentUser;
            };

            var setCurrentUser = function(currentUser) {
                window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                ipCookie('sessionid', currentUser.sessionid);
                ipCookie('csrftoken', currentUser.csrftoken);
                ipCookie('XMLHttpRequest', 'XMLHttpRequest');
            };

            var saveLoginFormData = function(loginData) {
                var loginDataToSave = {
                        userCode: loginData.userCode
                    },
                    keyName = ('loginData-' + loginDataToSave.userCode).toLocaleLowerCase(),
                    neverSaveLoginDataArr = JSON.parse(window.localStorage.getItem('neverSaveLoginData')) || [],
                    newNeverSaveArr = [];
                /**********Update never save**********************/
                neverSaveLoginDataArr.forEach(function(item) {
                    if (!(item === keyName)) newNeverSaveArr.push(item);
                });
                window.localStorage.setItem('neverSaveLoginData', JSON.stringify(newNeverSaveArr));
                /*************************************************************************************/
                window.localStorage.setItem(keyName, JSON.stringify(loginDataToSave));
                window.localStorage.setItem('lastLoginDataKey', keyName);
            };

            var existsInNeverSaveLoginFormData = function(loginData) {
                var exists = false,
                    keyName = ('loginData-' + loginData.userCode).toLocaleLowerCase(),
                    neverSaveLoginDataArr = JSON.parse(window.localStorage.getItem('neverSaveLoginData')) || [];
                neverSaveLoginDataArr.forEach(function(item) {
                    if (item === keyName) exists = true;
                });
                return exists;
            };

            var neverSaveLoginFormData = function(loginData) {
                var keyName = ('loginData-' + loginData.userCode).toLocaleLowerCase(),
                    neverSaveLoginDataArr = JSON.parse(window.localStorage.getItem('neverSaveLoginData')) || [];
                neverSaveLoginDataArr.push(keyName);
                window.localStorage.setItem('neverSaveLoginData', JSON.stringify(neverSaveLoginDataArr));
            };

            var getLoginFormData = function() {
                var keyName = window.localStorage.getItem('lastLoginDataKey');
                if (keyName) keyName = keyName.toLocaleLowerCase();
                return JSON.parse(window.localStorage.getItem(keyName));
            };

            var existsLoginData = function(loginData) {
                var keyName = ('loginData-' + loginData.userCode).toLocaleLowerCase();
                return !!window.localStorage.getItem(keyName);
            };

            var signIn = function(loginData) {
                var deferred = $q.defer();

                $http({
                        method: 'POST',
                        url: config.BASEURL + '/users/signin/',
                        data: {
                            username: loginData.userCode,
                            password: loginData.password
                        },
                        timeout: 60000
                    })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            setCurrentUser($filter('parseNewCurrentUser')(response.data, loginData.password));
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response.data.errors);
                        }
                    }, function errorCallback(response) {
                        deferred.reject('Error al iniciar sesión');
                    });

                return deferred.promise;
            };

            var signOut = function() {
                var deferred = $q.defer();
                try{
                    window.sessionStorage.removeItem('currentUser');
                    ipCookie.remove('sessionid');
                    ipCookie.remove('csrftoken');
                    ipCookie.remove('XMLHttpRequest');
                    deferred.resolve(true);
                }catch(e){
                    deferred.resolve(false);
                }
                return deferred.promise;
            };

            return {
                getCurrentUser: getCurrentUser,
                saveLoginFormData: saveLoginFormData,
                getLoginFormData: getLoginFormData,
                existsLoginData: existsLoginData,
                existsInNeverSaveLoginFormData: existsInNeverSaveLoginFormData,
                neverSaveLoginFormData: neverSaveLoginFormData,
                signIn: signIn,
                signOut: signOut
            };
        }]);
})();

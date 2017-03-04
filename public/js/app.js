(function() {

    var app = angular.module('rposts', [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'ipCookie',
        'httpPostFix',
        'rposts.services',
        'rposts.controllers',
        'rposts.directives',
        'rposts.filters',
        'rposts.configs'
    ]);

    var me = this;
    me.appUrls = {
        login: '/signin',
        root: '/',
        users: '/users'
    };

    var sessionOnProgress = function($q, $rootScope, $location) {
        var defer = $q.defer();
        if ($rootScope.currentUser) {
            $location.path('/');
        }
        defer.resolve();
        return defer.promise;
    };

    var loginRequired = function($q, $rootScope, $location) {
        var defer = $q.defer();
        if (!$rootScope.currentUser) {
            $location.path('/signin');
        }
        defer.resolve();
        return defer.promise;
    };

    app.run(['$rootScope', 'sessionService', function ($rootScope, sessionService) {
        Object.defineProperty($rootScope, 'currentUser', {
            get   : function () {
                return sessionService.getCurrentUser();
            }
        });
        $rootScope.appUrls = me.appUrls;
    }]);

    app.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.timeout         = 60000;

        $routeProvider
            //********************** GENERAL ***********************************************//
            .when(me.appUrls.root, {
                templateUrl: 'views/dashboard/dashboard.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when(me.appUrls.users, {
                templateUrl: 'views/users/users.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            //********************** OTHERS **********************************************//
            .when(me.appUrls.login, {
                templateUrl: 'views/session/login.html',
                resolve: {
                    check: sessionOnProgress
                }
            })
            .otherwise({
                redirectTo: me.appUrls.root
            });

    }]);
})();

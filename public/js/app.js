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
    };

    app.config(['$routeProvider', function($routeProvider) {

        $routeProvider
            //********************** OTHERS **********************************************//
            .when(me.appUrls.login, {
                templateUrl: 'views/session/login.html'
            })

    }]);
})();

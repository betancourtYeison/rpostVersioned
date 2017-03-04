(function() {
    angular.module('rposts.filters', [])
        .filter('parseNewCurrentUser', function($filter) {
            return function(data, password) {
                return {
                    sessionid: data.sessionid,
                    csrftoken: data.csrftoken,
                    username: data.username,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    password: password,
                };
            };
        })
        .filter('stateParser', function() {
            return function(arg) {
                switch (arg) {
                    case true:
                        state = '<span class="label label-success">Activo</span>';
                        break;
                    default:
                        state = '<span class="label label-danger">Inactivo</span>';
                        break;
                };
                return state;
            };
        });
})();

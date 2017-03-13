(function () {
	angular.module('rposts.directives', [])
		.directive('customSidebar', function () {
			return {
				restrict    : 'E',
				templateUrl : 'views/partials/sidebar/sidebar.html'
			};
		})
})();

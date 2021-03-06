'use strict';

angular.module('profile', ['ngRoute','angular-growl','textAngular','ngMaterial','ngMessages','ngImgCrop','ngFileUpload'])

.run(function ($rootScope, $location, $http) {
	$http.get('/token')
		.success(function (user, status) {
		if (user) {
			$rootScope.user = user;
      $http.defaults.headers.common["x-access-token"] = user.token.token;
      $http.defaults.headers.common["x-key"] = user._id;
		}
	});
})

.config(['growlProvider', function(growlProvider) {
	growlProvider.globalReversedOrder(true);
	growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
	growlProvider.globalDisableCountDown(true);
	growlProvider.globalPosition('top-center');
}]);

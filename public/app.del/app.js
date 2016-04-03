var myApp = angular.module('ngclient', ['ngRoute']);
 
myApp.config(function($routeProvider, $httpProvider) {
 
  $httpProvider.interceptors.push('TokenInterceptor');
 
  $routeProvider
    .when('/login', {
      templateUrl: 'views/partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false
      }
    }).when('/', {
      templateUrl: 'views/partials/home.html',
      controller: 'HomeCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/page1', {
      templateUrl: 'views/partials/page1.html',
      controller: 'Page1Ctrl',
      access: {
        requiredLogin: true
      }
    }).when('/page2', {
      templateUrl: 'views/partials/page2.html',
      controller: 'Page2Ctrl',
      access: {
        requiredLogin: true
      }
    }).when('/users', {
      templateUrl: 'views/partials/users.html',
      controller: 'Page3Ctrl',
      access: {
        requiredLogin: true
      }
    }).otherwise({
      redirectTo: '/login'
    });
});
 
myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
  // when the page refreshes, check if the user is already logged in
  var promise = AuthenticationFactory.check();
  promise.then(function(){
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    console.log("app->run->rchgStart::" + $location.path() + " - logged??" + AuthenticationFactory.isLogged);
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });
 
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    // 
    console.log("app->run->rchgSucc::" + $location.path() + " - logged??" + AuthenticationFactory.isLogged);
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});
});
GLClient.controller('AdminCtrl',
    ['$rootScope', '$scope', '$http', '$location', 'Admin',
function($rootScope, $scope, $http, $location, Admin) {

  // XXX this should actually be defined per controller
  // otherwise every time you open a new page the button appears enabled
  // because such item is !=
  $scope.master = {};

  // XXX convert this to a directive
  // This is used for setting the current menu in the sidebar
  var current_menu = $location.path().split('/').slice(-1);
  $scope.active = {};
  $scope.active[current_menu] = "active";

  $scope.admin = new Admin();

  $rootScope.$watch('languages_supported', function(){
    if ($rootScope.languages_supported) {
      $scope.enabled_languages = {};
      $.each($rootScope.languages_supported, function(lang){
        if ($rootScope.languages_supported[lang] in $rootScope.available_languages) {
          $scope.enabled_languages[$rootScope.languages_supported[lang]] = true;
        }
        else {
          $scope.enabled_languages[$rootScope.available_languages[lang]] = false;
        }
      });
    }
  });

  $scope.$watch('enabled_languages', function(){
    if (!$scope.enabled_languages)
      return;
    var languages_enabled = [];
    $.each($scope.enabled_languages, function(lang, enabled) {
      if (enabled) {
        languages_enabled.push(lang);
      } else {
        delete $rootScope.available_languages[lang];
      }
    });
    $scope.admin.node.languages_enabled = languages_enabled;

  }, true);
  // We need to have a special function for updating the node since we need to add old_password and password attribute
  // if they are not present
  $scope.updateNode = function(node) {

    if (node.password === undefined)
      node.password = "";
    if (node.check_password === undefined)
      node.password = "";
    if (node.old_password === undefined)
      node.old_password = "";
    $scope.update(node);
    $rootScope.language = node.languages_enabled[0];
  }

  $scope.update = function(model) {
    var success = {};
    success.message = "Updated " + model;
    model.$update(function(){
      if (!$rootScope.successes) {
        $rootScope.successes = [];
      };
      $rootScope.successes.push(success);
    });
  };

}]);

GLClient.controller('AdminPasswordCtrl', ['$scope', 'changePasswordWatcher',
                    function($scope, changePasswordWatcher) {
    changePasswordWatcher($scope, "admin.node.old_password",
        "admin.node.password", "admin.node.check_password");
}]);

GLClient.controller('AdminAdvancedCtrl', ['$scope', 'changeParamsWatcher',
                    function($scope, changeParamsWatcher) {
    changeParamsWatcher($scope);
}]);


GLClient.controller('ImageUploadCtrl', ['$scope', function($scope){
    $scope.uploadfile = false;

    // Used to keep track of weather or not the profile file has been changed
    // or not.
    $scope.fileSelected = false;
    $scope.changeProfile = function() {
      $scope.fileSelected = true;
    }

    $scope.closeProfile = function() {
      $scope.fileSelected = $scope.uploadfile = false;
    }

    $scope.openUploader = function() {
      $scope.uploadfile = true;
    }

    $scope.closeUploader = function() {
      $scope.uploadfile = false;
    }

}]);

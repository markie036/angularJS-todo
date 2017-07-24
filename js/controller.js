angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
        $scope.title = "Welcome To Angular Todo!"
    })
    .controller('RegisterController', function($scope, UserAPIService, store) {
        $scope.registrationUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";

        var authStorage = {
            name: 'StorageTest'
        };

        store.set('obj', authStorage);

        //Code for when the user has logged in
        $scope.login = function() {
            UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
                $scope.token = results.data.token;
                store.set('username', $scope.registrationUser.username);
                store.set('authToken', $scope.token);
                console.log($scope.token);
            }).catch(function(err) {
                console.log(err);
            });
        }
        //Login code ends

        $scope.submitForm = function() {
            if ($scope.registrationForm.$valid) {
                $scope.registrationUser.username = $scope.user.username;
                $scope.registrationUser.password = $scope.user.password;

        //registerUser been changed to callAPI as user has now been registered
                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    alert("You have successfully registered to Angular Todo");
                    $scope.login();
                }).catch(function(err) {
                    console.log(err);
                    alert("Registration failed, please try again with another username.");
                });
            }
        };
    });
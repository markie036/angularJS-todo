angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
        $scope.title = "Welcome To Angular Todo!"
    })
    .controller('RegisterController', function($scope, UserAPIService, store) {
        if (!store.get('authToken')) {   //if statement to check if user has been logged in...
            $location.path("/todo");    //...and where they should go once they are
        }
        $scope.registrationUser = {}; // empty object on our $scope here
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
            if ($scope.registrationForm.$valid) { // we are asking angular to submit the username and password data if the forms fields are valid.
                $scope.registrationUser.username = $scope.user.username; //scope will add these as a user within the data 
                $scope.registrationUser.password = $scope.user.password;

        //registerUser been changed to callAPI as user has now been registered
                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    alert("ALRIIIGHT!! You have successfully registered to Angular Todo you cool dude");
                    $scope.login();
                }).catch(function(err) {
                    console.log(err);
                    alert("Ahh man! Registration failed, please try again with another username.");
                });
            }
        };
    })
    
    // this will log a user in after registering
    .controller('LoginController', function($scope, $location, UserAPIService, store) {
        if (!store.get('authToken')) { //If statement to redirect logged in user to todo page. Will search for token for approval, 
            $location.path("/todo"); // but if it can't find the token, user will remain on page.
        } 
        $scope.loginUser = {}; // empty object on our $scope here
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.submitForm = function() { 
            if ($scope.loginForm.$valid) { // we are asking angular to submit the username and password data if the forms fields are valid.
                $scope.loginUser.username = $scope.user.username; //scope will add these as a user within the data 
                $scope.loginUser.password = $scope.user.password;

        //registerUser been changed to callAPI as user has now been registered
                UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results) {
                    $scope.data = results.data.token;
                    alert("You have successfully logged in you handsome man");
                    store.set('username', $scope.loginUser.username);
                    store.set('authToken', $scope.token);
                    $location.path('/todo');
                }).catch(function(err) {
                    console.log(err);
                    alert("Login failed, try again with another name cool dude.");
                });
            }
        };
    })

     //this function will log a user out
    .controller('LogoutController', function(store) {
        store.remove('username');
        store.remove('authToken'); 

    })

    .controller('TodoController', function($scope, $location, TodoAPIService, store) {
        if (!store.get('authToken')) {
            $location.path("/accounts/register");
        }
        var URL = "https://morning-castle-91468.herokuapp.com/";
 
        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
 
        $scope.todos = [];

        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
            $scope.todos = results.data;
            console.log($scope.todos);
        }).catch(function(err) {
            console.log(err);
        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push($scope.todo);

                TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
                    console.log(results);
                }).catch(function(err) {
                    console.log(err)
                });
            }
        }

        $scope.editTodo = function(id) {
                $location.path("/todo/edit/" + id);
            };
 
        $scope.deleteTodo = function(id) {
                TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
                    console.log(results);
                }).catch(function(err) {
                        console.log(err);
                });
        };

     })

    .controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
        var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";

        TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get('authToken')).then(function(results) {
            $scope.todo = results.data;
        }).catch(function(err) {
            console.log(err);
        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
 
                TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get('authToken')).then(function(results) {
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log(err);
                })
            }
        }
    });
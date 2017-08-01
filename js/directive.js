angular.module('TodoDirective',[]).directive('todoTable', function() {
  return {
    restrict: 'E',    // E -> element/attribute
    templateUrl: 'templates/directives/todo-table.html'
  };
});
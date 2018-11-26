angular.module('myapp').factory('TodoList', ['$rootScope',function($rootScope) {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var todolist = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'project/res/img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'project/res/img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'project/res/img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'project/res/img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'project/res/img/mike.png'
  }];

  return {
    all: function() {
      return todolist;
    },
    remove: function(todolist_item) {
      todolist.splice(todolist.indexOf(todolist_item), 1);
    },
    get: function(todolistId) {
      for (var i = 0; i < todolist.length; i++) {
        if (todolist[i].id === parseInt(todolistId)) {
          return todolist[i];
        }
      }
      return null;
    }
  };
}]);

angular.module('myapp').controller('ChatsCtrl',['$scope','Chats',function($scope,Chats) {
	$scope.chats = Chats.all();
  	$scope.remove = function(chat) {
    	Chats.remove(chat);
  	};
  	$scope.doRefresh = function() {
        
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
    $scope.pageRefresh = function(){
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
}])
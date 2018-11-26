angular.module('myapp').controller('DashCtrl',['$scope',function($scope) {
	$scope.tabNames=['java','html5','android'];
	$scope.slectIndex=0;
	$scope.activeSlide=function(index){//点击时候触发
	    $scope.slectIndex=index;
	    $ionicSlideBoxDelegate.slide(index);
	};
	$scope.slideChanged=function(index){//滑动时候触发
	    $scope.slectIndex=index;
	};
	$scope.pages=["project/templates/search_tabs/tab01.html","project/templates/search_tabs/tab02.html","project/templates/search_tabs/tab03.html"];
}])
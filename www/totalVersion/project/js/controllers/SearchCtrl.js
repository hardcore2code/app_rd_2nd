/*
 create by woody
 date 20170301
 查询页面controller
 */
angular.module('myapp').controller('SearchCtrl',['$scope','$ionicSlideBoxDelegate','$rootScope','$ionicSideMenuDelegate',function($scope,$ionicSlideBoxDelegate,$rootScope,$ionicSideMenuDelegate) {

	$scope.mySlide = {
		"height" : $rootScope.contextHeight+"px"
	};
	$scope.tabNames=['处置协议','转移计划','转移联单'];
	$scope.pages=["tab01.html","tab02.html",
		"tab03.html"];
	$scope.slectIndex=0;
	$scope.activeSlide=function(index){//点击时候触发
		$scope.slectIndex=index;
		$ionicSlideBoxDelegate.slide(index);
		$ionicSideMenuDelegate.toggleRight(false);
	};
	$scope.slideChanged=function(index){//滑动时候触发
		//向右滑
		var tabNames_LastIndex = $scope.tabNames.length-1;
		var width = document.body.offsetWidth;
		if($scope.slectIndex < index)
		{
			if(index>1 && index<tabNames_LastIndex)
			{
				var left = $scope.slectIndex*width*0.3;
				$("#tab-search-header-tab").scrollLeft(left);
			}
		}
		else  //向左滑
		{
			if(index>0 && index<tabNames_LastIndex-1)
			{
				var left = (index-1)*width*0.3;
				$("#tab-search-header-tab").scrollLeft(left);
			}
		}
		$ionicSideMenuDelegate.toggleRight(false);
		$scope.slectIndex=index;
	};

	var queryType=$rootScope.queryType == null ? 0 : $rootScope.queryType;
	$scope.slideIndex = queryType;
	$scope.activeSlide(queryType);
}])

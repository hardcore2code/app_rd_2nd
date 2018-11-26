/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('wlCtrl',['$scope','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($scope,$stateParams,LoginFilter,BackUtil,LoadUtil) {
	//检测是否已登录
	var userId=LoginFilter.loginFilter().userId;

	//返回方法
	$scope.myGoBack = function() {
		BackUtil.goBackFun();
	};

	//显示加载中的load提示信息
	LoadUtil.showLoad('加载中');
	//显示物流信息
	$scope.item=$stateParams.data.ldxx;
	$scope.status=$scope.item.status;
	//关闭load加载层信息
	LoadUtil.hideLoad();
}])
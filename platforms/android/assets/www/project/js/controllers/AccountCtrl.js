/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('AccountCtrl',['$scope','$rootScope','$state','localStorageService','$ionicPopup','LoginFilter','Init','LoadUtil','Alert',function($scope,$rootScope,$state,localStorageService,$ionicPopup,LoginFilter,Init,LoadUtil,Alert) {

	$scope.userData=LoginFilter.loginFilter();
	$scope.loginOut=function()
	{
		LoadUtil.showLoad('登出中');
		var param={IWBSESSION:localStorageService.get('IWBSESSION')};
		Init.iwbhttp('/user/logout', param, function(data,header,config,status){
			if(data.resFlag == 0){
				$scope.tc();
			}
			Alert.myToastBottom({mess:data.msg,height:-160});
		},function(data,header,config,status){
			$scope.tc();
		});
	};

	$scope.tc=function()
	{
		localStorageService.set("userData",null);
		$state.go("login");
		LoadUtil.hideLoad();
	}
	//  confirm 对话框
	$scope.showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: '注销提示',
			template: '您确定要退出登录吗？',
			cancelText:'取消',
			okText:'确定',
			cancelType:'button-positive alterButton',
			okType:'button-positive alterButton'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$scope.loginOut();
			} else {
			}
		});
	};
}])
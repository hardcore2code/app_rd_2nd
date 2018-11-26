/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('AccountCtrl',['$scope','$rootScope','$state','localStorageService','$ionicPopup','LoginFilter','Init','LoadUtil','Alert','$cordovaFileTransfer','$cordovaFileOpener2',function($scope,$rootScope,$state,localStorageService,$ionicPopup,LoginFilter,Init,LoadUtil,Alert,$cordovaFileTransfer,$cordovaFileOpener2) {
	//检测是否已登录
	$scope.userData=LoginFilter.loginFilter();
	//登出方法
	$scope.loginOut=function()
	{
		LoadUtil.showLoad('登出中');
		var param={IWBSESSION:localStorageService.get('IWBSESSION')};
		Init.iwbhttp('/user/logout', param, function(data,header,config,status){
			//if(data.resFlag == 1){
			//	Alert.myToastBottom({mess:"服务器端注销失败",height:-160});
			//}
			Alert.myToastBottom({mess:"退出成功！",height:-160});
		},function(data,header,config,status){
		});
		$scope.tc();
	};

	//清空所有缓存信息
	$scope.tc=function()
	{
		localStorageService.set("userData",null);
		$rootScope.beg0=null;
		$rootScope.end0=null;
		$rootScope.state0=null;
		$rootScope.beg1=null;
		$rootScope.end1=null;
		$rootScope.state1=null;
		$rootScope.beg2=null;
		$rootScope.end2=null;
		$rootScope.state2=null;
		$rootScope.queryStatus2=null;
		$rootScope.queryStatus1=null;
		$rootScope.queryStatus0=null;
		$rootScope.queryContext2=null;
		$rootScope.queryContext1=null;
		$rootScope.queryContext0=null;
		$state.go("login");
		LoadUtil.hideLoad();
	}
	//  confirm 对话框
	$scope.showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: '提示',
			template: '<div style="padding-top: 10px;padding-bottom: 10px;">您确定要退出登录吗？</div>',
			cancelText:'取消',
			okText:'确定',
			cancelType:'button-positive buttonMy alterButton',
			okType:'button-positive buttonMy alterButton'
		});
		confirmPopup.then(function(res) {
			if(res) {
				//执行登出方法
				$scope.loginOut();
			} else {
			}
		});
	};

	//版本校验更新
	var myPopup;
	var download = "";
	$scope.downloadProgress_show = '';
	$scope.checkAppVersion = function (){
		Init.iwbhttp("/appVersion/checkAppVersion",{appId:$rootScope.appId,appVersion:$rootScope.appVersion},function(data,header,config,status){
			if(data.resFlag == "0"){
				$scope.noticeContent = "已有新版本，立即更新？";
				myPopup = $ionicPopup.show({
					template: '<div align="center">{{noticeContent}}</div>',
					title: '',
					subTitle: '',
					scope: $scope,
					buttons: [
						{   text: '取消',
							type:'button-positive buttonMy alterButton',
							onTap: function(e) {
								if(download != ""){
									download.abort();
									download = "";
								}
							}
						},
						{
							text: '确定',
							type:'button-positive buttonMy alterButton',
							onTap: function(e) {
								e.preventDefault();
								var obj = {
									url:$rootScope.apkPath,
									fileDir:$rootScope.apkFileDir+$rootScope.apkName,
									trustHosts : true,
									options : {}
								};
								downloadFile(obj);
							}
						},
					]
				});
			}else{
				Alert.myToastBottom({mess: data.msg, height: -160});
			}
			LoadUtil.hideLoad();
		},function(data,header,config,status){
		});
	}

	var downloadFile = function(obj)
	{
		if(download != ""){
			Alert.myToastBottom({mess: "下载中，请勿重复下载！", height:-160});
			return false;
		}
		download = $cordovaFileTransfer.download(obj.url,obj.fileDir,obj.options,obj.trustHosts);
		download.then(function (success) {
			$scope.downloadProgress = 100;
			$scope.downloadProgress_show = '100%';
			$scope.noticeContent = "请稍等，已下载"+$scope.downloadProgress_show;
			myPopup.close();
			download = "";
			$cordovaFileOpener2.open(obj.fileDir, 'application/vnd.android.package-archive')
				.then(function () {
				}, function (err) {
				});
		}, function (error) {
			Alert.myToastBottom({mess: "下载失败！", height:-160});
			download = "";
		}, function (progress) {
			$scope.downloadProgress = (progress.loaded / progress.total) * 100;
			$scope.downloadProgress_show = parseInt($scope.downloadProgress)+'%';
			$scope.noticeContent = "请稍等，已下载"+$scope.downloadProgress_show;
		});
	}
}])

/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('TodoListDetail2Ctrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','Alert','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,Alert,LoginFilter,BackUtil,LoadUtil) {
    var itemId = $stateParams.data.tpId;
	var processinstid = $stateParams.data.processinstid;
	var workItemId = $stateParams.data.workItemId;
	var userId=LoginFilter.loginFilter().userId;

	$scope.myGoBack = function() {
		//$ionicViewSwitcher.nextDirection('back');
		//$state.go('todolist-detail',{data:{processinstId:processinstid,workItemId:workItemId}});
		BackUtil.goBackFun();
	};

	if(Init.connectionTest()) return;
	LoadUtil.showLoad('加载中');
	var param={bizId:itemId,userId:userId,ps:999,pn:1};
	console.log("param="+JSON.stringify(param));
	Init.iwbhttp('/statistics/appCallAuditCx', param, function(data,header,config,status){
		if(data.resFlag == 0) {
			$scope.items = data.list;
			$rootScope.isTrue = 1;
		}else{
			Alert.myToastBottom({mess:data.msg,height:-160});
			$rootScope.isTrue = 0;
		}
		LoadUtil.hideLoad();
	},function(data,header,config,status){
	});
}])
/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('TodoListDetail2Ctrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','Alert','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,Alert,LoginFilter,BackUtil,LoadUtil) {
    //接收查询列表界面传过来的参数转移计划编号、工作留编号、流程编号
	var itemId = $stateParams.data.tpId;
	var processinstid = $stateParams.data.processinstid;
	var workItemId = $stateParams.data.workItemId;
	//检测是否已登录
	var userId=LoginFilter.loginFilter().userId;
	//返回方法
	$scope.myGoBack = function() {
		//$ionicViewSwitcher.nextDirection('back');
		//$state.go('todolist-detail',{data:{processinstId:processinstid,workItemId:workItemId}});
		BackUtil.goBackFun();
	};

	LoadUtil.showLoad('加载中');
	//查询审批历史信息
	var param={bizId:itemId,userId:userId,ps:999,pn:1};
	console.log("param="+JSON.stringify(param));
	Init.iwbhttp('/statistics/appCallAuditCx', param, function(data,header,config,status){
		if(data.resFlag == 0) {
			$scope.items = data.list;
			if($scope.items == "" ){
				$scope.isTrue = 0;
			}
			else
			{
				$scope.isTrue = 1;
			}
		}else{
			Alert.myToastBottom({mess:data.msg,height:-160});
			$scope.isTrue = 0;
		}
		LoadUtil.hideLoad();
	},function(data,header,config,status){
	});
}])
/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('TodoListDetailCtrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','$ionicPopup','Alert','LoginFilter','BackUtil','LoadUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,$ionicPopup,Alert,LoginFilter,BackUtil,LoadUtil,LoadUtil) {
    var processinstid = $stateParams.data.processinstId;
    var workItemId = $stateParams.data.workItemId;
	var userData=LoginFilter.loginFilter();
	$scope.lookCheckList = function(tpId)
	{
		$ionicViewSwitcher.nextDirection('forward');
		$stateParams.data.backUrl=$state.current.name;
		$stateParams.data.level=2;
		BackUtil.addBackInfo($stateParams);
		$state.go('todolist-detail-2',{data:{tpId:tpId,processinstid:processinstid,workItemId:workItemId}});
	};

	$scope.checkInfo = function(type)
	{
		var checkRemark="";
		var alt="";
		if(type == 0)
		{
			//驳回
			alt="驳回";
			$scope.showPopup(type,alt);
		}
		else
		{
			//通过
			alt="通过";
			$scope.checkIng(type,checkRemark,alt);
		}
	};



	$scope.checkIng = function(type,checkRemark,alt) {
		if(checkRemark.length > 20)
		{
			Alert.myToastBottom({mess:"驳回理由的长度必须小于等于20个字符！",height:-160});
			return;
		}
		if(Init.connectionTest()) return;
		LoadUtil.showLoad(alt+'中');
		var param={componentName:"com.service.refusedisposal.transferplan.apply",logicFlowName:"appCallApprove",userId:userData.userId
			,userName:userData.userName,orgCode:userData.orgCode,orgSeq:userData.orgSeq,operatorId:userData.operatorId
			,orgId:userData.orgId,orgName:userData.orgName,realName:userData.realName,empId:userData.empId,
			paramsMap:{workitemid: workItemId,processinstid:processinstid,checkResult:type,checkAdvice:checkRemark}};
		Init.eoshttp(param,function(data,header,config,status){
			if(data.runStatue == 0){
				$("#tg").attr("disabled", "disabled");
				$("#bh").attr("disabled", "disabled");
				$rootScope.checkStatus=false;
				Alert.alertTemplate({title:alt+"提示",content:"审核"+alt+"成功！"});
			}else{
				Alert.alertTemplate({title:alt+"提示",content:"审核"+alt+"失败！"});
			}
			LoadUtil.hideLoad();
		},function(data,header,config,status){
		});
	};

	$scope.myGoBack = function() {
		BackUtil.goBackFun();
	};

	if(Init.connectionTest()) return;
	LoadUtil.showLoad('加载中');
	var param={tpId:"",processinstId:processinstid,userId:userData.userId};
	Init.iwbhttp('/statistics/getTransferPlanByTpId', param, function(data,header,config,status){
		if(data.resFlag == 0){
			$scope.items = data.entityData.subList;
			$scope.im = data.entityData;
			$scope.hStatus = data.entityData.hStatus;
			$rootScope.isTrue=1;
		}else{
			Alert.myToastBottom({mess:data.msg,height:-160});
			$rootScope.isTrue=0;
		}
		LoadUtil.hideLoad();
	},function(data,header,config,status){
	});

	$scope.showPopup = function(type,alt) {
		$scope.data = {}

		// 自定义弹窗
		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-maxlength="20" placeholder="长度必须小于等于20位！" maxlength="20" style="font-size: 15px;width: 100%;" ng-model="data.checkRemark">',
			title: '驳回提示',
			subTitle: '请输入驳回原因！',
			scope: $scope,
			buttons: [
				{ text: '取消', type: 'button-positive alterButton' },
				{
					text: '<b>确定</b>',
					type: 'button-positive alterButton',
					onTap: function(e) {
						if (!$scope.data.checkRemark) {
							// 不允许用户关闭，除非输入 wifi 密码
							e.preventDefault();
						} else {
							return $scope.data.checkRemark;
						}
					}
				},
			]
		});

		myPopup.then(function(res) {
			if(res != undefined)
			{
				$scope.checkIng(type,res,alt);
			}
		});
	};

}])
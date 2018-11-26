/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('TodoListDetailCtrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','$ionicPopup','Alert','LoginFilter','BackUtil','LoadUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,$ionicPopup,Alert,LoginFilter,BackUtil,LoadUtil,LoadUtil) {
	//接收查询列表界面传过来的参数工作留编号、流程编号
    var processinstid = $stateParams.data.processinstId;
    var workItemId = $stateParams.data.workItemId;
	//检测是否已登录
	var userData=LoginFilter.loginFilter();
	//查询审批历史明细信息
	$scope.lookCheckList = function(tpId)
	{
		//$ionicViewSwitcher.nextDirection('forward');
		$stateParams.data.backUrl=$state.current.name;
		$stateParams.data.level=2;
		BackUtil.addBackInfo($stateParams);
		$state.go('todolist-detail-2',{data:{tpId:tpId,processinstid:processinstid,workItemId:workItemId}});
	};

	//点击通过或驳回的方法
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
		LoadUtil.showLoad(alt+'中');
		if(userData.orgCode == 'SHB')
		{
			//市级环保进行审批的方法
			$scope.sp(null,null,type,checkRemark,alt);
		}
		else
		{
			//区级环保局进行审批的方法
			var param={roleId1:"SJSPROLE",roleId2:"QJSPROLE",btoId1:"SHB",btoId2:userData.orgCode};
			Init.iwbhttp('/statistics/queryPresonInfo', param, function(data,header,config,status){
				if(data.resFlag == 0){
					$scope.sp(data.list1,data.list2,type,checkRemark,alt);
				}else{
					Alert.myToastBottom({mess:data.msg,height:-160});
					$rootScope.isTrue=0;
					LoadUtil.hideLoad();
				}
			},function(data,header,config,status){
			});
		}
	};

	//返回方法
	$scope.myGoBack = function() {
		BackUtil.goBackFun();
	};

	//审批方法
	$scope.sp = function(list1,list2,type,checkRemark,alt) {
		var param2={componentName:"com.service.refusedisposal.transferplan.apply",logicFlowName:"appCallApprove",userId:userData.userId
			,userName:userData.userName,orgCode:userData.orgCode,orgSeq:userData.orgSeq,operatorId:userData.operatorId
			,orgId:userData.orgId,orgName:userData.orgName,realName:userData.realName,empId:userData.empId,
			paramsMap:{workitemid: workItemId,processinstid:processinstid,checkResult:type,checkAdvice:checkRemark,list1:list1,list2:list2}};
		Init.eoshttp(param2,function(data,header,config,status){
			if(data.runStatue == 0){
				$("#tg").attr("disabled", "disabled");
				$("#bh").attr("disabled", "disabled");
				$rootScope.checkStatus=false;
				Alert.alertTemplate({title:"提示",content:"审核"+alt+"成功！"});
			}else{
				Alert.alertTemplate({title:"提示",content:"审核"+alt+"失败！"});
			}
			LoadUtil.hideLoad();
		},function(data,header,config,status){
		});
	};

	LoadUtil.showLoad('加载中');
	//根据转移计划编号查询转移计划详细信息
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

	//弹出输入驳回原因的提示框
	$scope.showPopup = function(type,alt) {
		$scope.data = {}

		// 自定义弹窗
		var myPopup = $ionicPopup.show({
			template: '<div align="center" style="font-size: 14px;padding-top: 5px;">请输入驳回原因！</div><textarea ng-maxlength="20" placeholder="长度必须小于等于20位！" maxlength="20" style="font-size: 15px;width: 100%;padding-top: 0px;padding-bottom: 0px;margin-top: 5px;margin-bottom: 5px;line-height: 20px;height: 40px;" ng-model="data.checkRemark"></textarea>',
			title: '提示',
			scope: $scope,
			buttons: [
				{ text: '取消', type: 'button  button-calm  buttonMy alterButton' },
				{
					text: '<b>确定</b>',
					type: 'button button-calm buttonMy alterButton',
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
				//审核转移计划
				$scope.checkIng(type,res,alt);
			}
		});
	};

}])
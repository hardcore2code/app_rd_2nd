/**
 * Created by woody on 2015/11/8.
 */
angular.module('myapp').controller('Tab02DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,$stateParams,LoginFilter,BackUtil,LoadUtil) {
    var tpId = $stateParams.data.tpId;
    //检测是否已登录
    var userId=LoginFilter.loginFilter().userId;
    //返回方法
    $scope.myGoBack = function() {
        BackUtil.goBackFun();
    };

    //协议状态长按事件
    $scope.onHold = function(){
        //长度超过4位显示不全才会弹出显示
        if($scope.im.statusName.length>4)
        {
            $("#"+$scope.im.tpId+"detail").css('display','block');
        }
    };

    //协议状态长按松手隐藏事件
    $scope.onRelease = function(){
        $("#"+$scope.im.tpId+"detail").css('display','none');
    };
    //显示加载中的load提示信息
    LoadUtil.showLoad('加载中');
    //查询转移计划明细信息
    var param={tpId:tpId,userId:userId,processinstId:""};
    Init.iwbhttp('/statistics/getTransferPlanByTpId', param, function(data,header,config,status){
        if(data.resFlag == 0){
            $scope.items = data.entityData.subList;
            $scope.im = data.entityData;
            $rootScope.isTrue=1;
        }else{
            Alert.myToastBottom({mess:data.msg,height:-160});
            $rootScope.isTrue=0;
        }
        //关闭load加载层信息
        LoadUtil.hideLoad();
    },function(data,header,config,status){
    });

    //查询历史审核信息
    $scope.lookCheckList = function()
    {
        //$ionicViewSwitcher.nextDirection('forward');
        $stateParams.data.backUrl=$state.current.name;
        $stateParams.data.level=2;
        BackUtil.addBackInfo($stateParams);
        $state.go('todolist-detail-2',{data:{tpId:tpId,processinstid:null,workItemId:null}});
    };
}]);

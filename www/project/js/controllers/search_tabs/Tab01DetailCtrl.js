/**
 * Created by woody on 2015/11/8.
 */
angular.module('myapp').controller('Tab01DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','LoginFilter','$stateParams','BackUtil','LoadUtil','$ionicNativeTransitions',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,LoginFilter,$stateParams,BackUtil,LoadUtil,$ionicNativeTransitions) {
    var amId = $stateParams.data.amId;
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
            $("#"+$scope.im.amId+"detail").css('display','block');
        }
    };

    //协议状态长按松手隐藏事件
    $scope.onRelease = function(){
        $("#"+$scope.im.amId+"detail").css('display','none');
    };

    //显示加载中的load提示信息
    LoadUtil.showLoad('加载中');
    var param={amId:amId,userId:userId};
    //查询协议明细信息
    Init.iwbhttp('/statistics/getArgeementByAmId', param, function(data,header,config,status){
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
}]);

/**
 * Created by woody on 2015/11/8.
 */
angular.module('myapp').controller('Tab02DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,$stateParams,LoginFilter,BackUtil,LoadUtil) {
    var tpId = $stateParams.data.tpId;
    var userId=LoginFilter.loginFilter().userId;
    $scope.myGoBack = function() {
        BackUtil.goBackFun();
    };

    $scope.onHold = function(){
        if($scope.im.statusName.length>4)
        {
            $("#"+$scope.im.tpId+"detail").css('display','block');
        }
    };

    $scope.onRelease = function(){
        $("#"+$scope.im.tpId+"detail").css('display','none');
    };

    if(Init.connectionTest()) return;
    LoadUtil.showLoad('加载中');
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
        LoadUtil.hideLoad();
    },function(data,header,config,status){
    });
}]);

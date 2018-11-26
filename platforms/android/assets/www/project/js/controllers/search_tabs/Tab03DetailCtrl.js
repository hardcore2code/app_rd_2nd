/**
 * Created by woody on 2015/11/8.
 */
angular.module('myapp').controller('Tab03DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,$stateParams,LoginFilter,BackUtil,LoadUtil) {
    var tbId = $stateParams.data.tbId;
    var userId=LoginFilter.loginFilter().userId;
    $scope.myGoBack = function() {
        BackUtil.goBackFun();
    };

    $scope.onHold = function(){
        if($scope.im.statusName.length>4)
        {
            $("#"+$scope.im.tbId+"detail").css('display','block');
        }
    };

    $scope.onRelease = function(){
        $("#"+$scope.im.tbId+"detail").css('display','none');
    };

    if(Init.connectionTest()) return;
    LoadUtil.showLoad('加载中');
    var param={tbId:tbId,userId:userId};
    Init.iwbhttp('/statistics/getTransferplanBillByTbId', param, function(data,header,config,status){
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

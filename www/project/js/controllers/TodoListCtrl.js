angular.module('myapp').controller('TodoListCtrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil) {
    //检测是否已登录
    var userData=LoginFilter.loginFilter();
    //审批级别和审批级别名称参数默认为区级审批
    var checkLevel="01";
    var checkLevelName="区级审批";
    $rootScope.checkStatus=true;
    //如果机构编号为172则未市局审批，设置审批级别和审批级别名称参数
    if(userData.orgId == 172)
    {
        checkLevel="02";
        checkLevelName="市级审批";
    }
    //第一次查询方法
    $scope.doRefresh = function() {
        //LoadUtil.showLoad('加载中');
        var param={userId:userData.userId,orgCode:userData.orgCode,pn:1,ps:10,checkLevel:checkLevel,checkLevelName:checkLevelName};
        Init.iwbhttp('/statistics/queryTransferPlanCheckList', param, function(data,header,config,status){
            if(data.resFlag == 0){
                $scope.items = data.list;
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pageNum=1;
                if($scope.items == ""){
                    $scope.listIsNull = 0;
                    $scope.isTrue=0;
                    Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                }else{
                    $scope.listIsNull = 1;
                    if($scope.pageNum == $scope.totalPage)
                    {
                        $scope.isTrue=0;
                    }
                    else
                    {
                        $scope.isTrue=1;
                    }
                    Alert.myToastBottom({mess:"查出"+data.totalRow+"条记录",height:-160});
                }
            }else{
                Alert.myToastBottom({mess:data.msg,height:-160});
            }
            //LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    //翻页查询方法
    $scope.pageRefresh = function(){
        if($scope.pageNum < $scope.totalPage)
        {
            //LoadUtil.showLoad('加载中');
            $scope.isTrue=0;
            $scope.pageNum =  $scope.pageNum +1;
            var param={userId:userData.userId,orgCode:userData.orgCode,pn:$scope.pageNum,ps:10,checkLevel:checkLevel,checkLevelName:checkLevelName};
            Init.iwbhttp('/statistics/queryTransferPlanCheckList', param, function(data,header,config,status){
                if(data.resFlag == 0){
                    var items_temp = data.list;
                    $scope.totalPage = parseInt(data.totalPage);
                    angular.forEach(items_temp,function(value,i){
                        $scope.items.push(value);
                    });
                    if(items_temp == ""){
                        $scope.isTrue=0;
                        Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                    }else{
                        $scope.isTrue=1;
                        if($scope.pageNum == $scope.totalPage)
                        {
                            $scope.isTrue=0;
                            Alert.myToastBottom({mess:"已到末页！",height:-160});
                        }
                    }
                }else{
                    Alert.myToastBottom({mess:data.msg,height:-160});
                }
                //LoadUtil.hideLoad();
            },function(data,header,config,status){
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    //查询明细审批信息方法
    $scope.listInfo = function(processinstid,workItemId){
        //$ionicViewSwitcher.nextDirection('forward');
        BackUtil.addBackInfo({data:{level:1,backUrl:$state.current.name}});
        $state.go('todolist-detail',{data:{processinstId:processinstid,workItemId:workItemId}});
        $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableAnimate: true,
            expire: 300
        });
        $timeout( function() {
            $ionicHistory.nextViewOptions({
                historyRoot: false,
                disableAnimate: false
            });
        }, 300);
    };

    //默认查询动作
    $scope.doRefresh();
}]);
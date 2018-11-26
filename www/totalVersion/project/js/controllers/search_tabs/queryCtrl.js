/**
 * Created by admin on 2017/4/5.
 */
angular.module('myapp').controller('queryCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','localStorageService','Alert','$ionicPopup','BackUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,localStorageService,Alert,$ionicPopup,BackUtil) {
    $scope.myGoBack = function(type)
    {
        if(type)
        {
            $scope.setNullQueryCtx();
        }
        BackUtil.goBackFun();
    };

    $scope.pageInit=function()
    {
        //$rootScope.queryType:0-处置协议，1-转移计划，2-转移联单
        if($rootScope.queryType==0)
        {
            $scope.Items =localStorageService.get("queryList1");
        }
        else if($rootScope.queryType==1)
        {
            $scope.Items =localStorageService.get("queryList2");
        }
        else if($rootScope.queryType==2)
        {
            $scope.Items =localStorageService.get("queryList3");
        };
        $scope.searchCont = {};
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.search = function()
    {
        var queryContext=$("#search").val();
        if(queryContext.length > 0)
        {
            //存入localStorageService
            if($scope.Items == null)
            {
                $scope.Items=[{queryContext:queryContext}];
            }
            else
            {
                var beginIndex=$scope.Items.length >= 9 ? 9 : $scope.Items.length;
                var isHas=false;
                for(var i=0; i< beginIndex; i++)
                {
                    if($scope.Items[i].queryContext == queryContext)
                    {
                        isHas=true;
                        break;
                    }
                }
                if(!isHas)
                {
                    for(var i=beginIndex; i>0;i--)
                    {
                        $scope.Items[i]=$scope.Items[i-1];
                    }
                    $scope.Items[0]={queryContext:queryContext};
                }
            }
            if($rootScope.queryType==0)
            {
                localStorageService.set("queryList1",$scope.Items);
                $rootScope.queryContext0=queryContext;
                $rootScope.queryStatus0="TJ"
            }
            else if($rootScope.queryType==1)
            {
                localStorageService.set("queryList2",$scope.Items);
                $rootScope.queryContext1=queryContext;
                $rootScope.queryStatus1="TJ"
            }
            else if($rootScope.queryType==2)
            {
                localStorageService.set("queryList3",$scope.Items);
                $rootScope.queryContext2=queryContext;
                $rootScope.queryStatus2="TJ"
            };
        }
        else
        {
            $scope.setNullQueryCtx();
        }
        //返回查询列表页面
        $scope.myGoBack();
    };

    $scope.query = function(queryContext)
    {
        $("#search").val(queryContext);
        $scope.search();
    };


    $scope.clearQuery = function()
    {
        //  confirm 对话框
        var confirmPopup = $ionicPopup.confirm({
            title: '删除搜索记录提示',
            template: '您确定要删除搜索记录吗？',
            cancelText:'取消',
            cancelType: 'button-positive alterButton',
            okText:'确定',
            okType:'button-positive alterButton'
        });
        confirmPopup.then(function(res) {
            if(res) {
                if($rootScope.queryType==0)
                {
                    localStorageService.set("queryList1",null);
                }
                else if($rootScope.queryType==1)
                {
                    localStorageService.set("queryList2",null);
                }
                else if($rootScope.queryType==2)
                {
                    localStorageService.set("queryList3",null);
                }
                $scope.Items=[];
            }
        });
    };

    $scope.clearSearch = function()
    {
        $scope.searchCont = {};
    };

    $scope.setNullQueryCtx = function()
    {
        if($rootScope.queryType==0)
        {
            $rootScope.queryContext0="";
            $rootScope.queryStatus0="ALL";
        }
        else if($rootScope.queryType==1)
        {
            $rootScope.queryContext1="";
            $rootScope.queryStatus1="ALL";
        }
        else if($rootScope.queryType==2)
        {
            $rootScope.queryContext2="";
            $rootScope.queryStatus2="ALL";
        };
    };

    $scope.pageInit();
}]);

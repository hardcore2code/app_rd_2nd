/**
 * Created by admin on 2017/4/5.
 */
angular.module('myapp').controller('queryCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','localStorageService','Alert','$ionicPopup','BackUtil','$timeout',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,localStorageService,Alert,$ionicPopup,BackUtil,$timeout) {
    //返回方法
    $scope.myGoBack = function(type)
    {
        if(type)
        {
            $scope.setNullQueryCtx();
        }
        //$("#search").blur();
        $timeout(function(){
            BackUtil.goBackFun();
        },100);
    };

    //页面初始化
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

    //查询方法
    $scope.search = function()
    {
        var queryContext=$("#search").val();
        $("#search").blur();
        if(queryContext.length > 0)
        {
            if(queryContext.indexOf("'") >-1)
            {
                Alert.myToastBottom({mess:"查询内容包含非法字符，请重新输入！",height:-160});
                $("#search").val("");
                return;
            }
            if(queryContext == '天津' || queryContext == '公司' || queryContext == '天津公司')
            {
                Alert.myToastBottom({mess:"查询内容不够精准，请重试！",height:-160});
                return;
            }
            //存入localStorageService
            if($scope.Items == null)
            {
                $scope.Items=[{queryContext:queryContext}];
            }
            else
            {
                //最多保存10条查询历史记录，获取当前已有查询结果总数
                var beginIndex=$scope.Items.length >= 9 ? 9 : $scope.Items.length;
                var isHas=false;
                //检测搜索历史记录中是否存在
                for(var i=0; i< beginIndex; i++)
                {
                    if($scope.Items[i].queryContext == queryContext)
                    {
                        isHas=true;
                        break;
                    }
                }
                //如果不存在
                if(!isHas)
                {
                    //将之前的搜索历史依次向后放一个位置
                    for(var i=beginIndex; i>0;i--)
                    {
                        $scope.Items[i]=$scope.Items[i-1];
                    }
                    //将本次搜索历史内容存入第一位
                    $scope.Items[0]={queryContext:queryContext};
                }
            }
            //保存查询劣势信息，设置查询状态和查询条件供查询功能使用
            //$rootScope.queryType:0-处置协议，1-转移计划，2-转移联单
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
            //清理查询内容内容并且将查询标志设置为查询所有
            $scope.setNullQueryCtx();
        }
        //返回查询列表页面
        $scope.myGoBack();
    };

    //点击查询历史时调用的查询方法
    $scope.query = function(queryContext)
    {
        $("#search").val(queryContext);
        $scope.search();
    };

    //清空查询历史的方法
    $scope.clearQuery = function()
    {
        //  confirm 对话框
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '<div style="padding-top: 10px;padding-bottom: 10px;">您确定要删除搜索记录吗？</div>',
            cancelText:'取消',
            cancelType: 'button-positive buttonMy alterButton',
            okText:'确定',
            okType:'button-positive buttonMy alterButton'
        });
        confirmPopup.then(function(res) {
            if(res) {
                //根据查询类型清空不同插叙那功能的查询历史信息
                //$rootScope.queryType:0-处置协议，1-转移计划，2-转移联单
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

    //清理查询内容内容并且将查询标志设置为查询所有
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

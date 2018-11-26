angular.module('myapp').controller('Tab02Ctrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil','$ionicScrollDelegate',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil,$ionicScrollDelegate) {
    $scope.myStyle={
        "min-height":$rootScope.contextHeight+"px",
        "height":$rootScope.contextHeight+"px"
    }
    //检测是否已登录
    var userData=LoginFilter.loginFilter();
    $scope.listIsNull1=0;
    //将医转移计划状态字典宝信息放到缓存中
    Init.dicthttp("TP_STATUS",function(data,header,config,status){
        $scope.dicts=data.list;
    },function(data,header,config,status){
    });

    //筛选按钮事件
    $scope.toggleRight = function(param) {
        if(param)
        {
            $("#status1").val($rootScope.state1);
        }
        $ionicSideMenuDelegate.toggleRight(param);
    };

    //筛选按钮事件
    $scope.sx = function() {
        if($rootScope.beg1 != null && $rootScope.end1 != null && $rootScope.beg1>$rootScope.end1)
        {
            Alert.alertTemplate({title:"提示",content:"周期起始日必须小于等于周期终止日！"});
            return;
        }
        $rootScope.queryStatus1="SX"
        $rootScope.state1=$("#status1").val();
        $scope.toggleRight(false);
        $scope.doRefresh();
    };

    //清理查询条件
    $scope.clearParam = function() {
        $("#begDate1").val("点击选择日期");
        $rootScope.beg1=null;
        $("#endDate1").val("点击选择日期");
        $rootScope.end1=null;
        $("#status1").val(null);
        $rootScope.state1=null;
    };

    //打开日历控件事件
    $scope.openDatePickerOne = function (type) {
        var currYear=new Date().getFullYear();
        var begYear=currYear-10;
        var endYear=currYear+10;
        var ipObj2 = {
            callback: function (val) {  //Mandatory
                var date=new Date(val);
                var year=date.getFullYear();
                var month=date.getMonth() < 9 ? "0"+(date.getMonth()+1) :(date.getMonth()+1);
                var day=date.getDate() < 10 ? "0"+date.getDate() :date.getDate();
                if(type == 1)
                {
                    $("#begDate1").val(year+ "-" + month + "-" + day);
                    $rootScope.beg1=year+ "-" + month + "-" + day;
                }
                else if (type == 2)
                {
                    $("#endDate1").val(year + "-" + month + "-" + day);
                    $rootScope.end1=year+ "-" + month + "-" + day;
                };
            },
            //这是不可选的日期列表
            disabledDates: [
                //new Date(2017, 4, 16),
                //new Date(2015, 3, 16),
                //new Date(2015, 4, 16),
                //new Date(2015, 5, 16),
                //new Date('Wednesday, August 12, 2015'),
                //new Date("08-16-2016"),
                //new Date(1439676000000)
            ],
            titleLabel: '选择日期',  //可选
            setLabel: '确定',
            todayLabel: '今天',
            closeLabel: '关闭',
            showTodayButton: 'true',
            setButtonType: 'button-assertive',  //可选
            modalHeaderColor: '#D54D2B', //可选
            modalFooterColor: '#D54D2B', //可选
            from: new Date(begYear, 1, 1),
            to: new Date(endYear, 12, 31),
            dateFormat: 'yyyy-MM-dd',
            inputDate: new Date(),
            //方便的年月日设置方式
            weeksList:  ["日", "一", "二", "三", "四", "五", "六"],
            monthsList:  ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            mondayFirst: true,
            disableWeekdays: [],
            closeOnSelect: true,
            templateType: 'modal'
        };
        ionicDatePicker.openDatePicker(ipObj2);
    };

    //首次查询方法
    $scope.doRefresh = function() {
        //LoadUtil.showLoad('加载中');
        var queryStatus=$rootScope.state1 == null ? "" :$rootScope.state1;
        var begDate=$rootScope.beg1 == null ? "" : $rootScope.beg1;
        var endDate=$rootScope.end1 == null ? "" : $rootScope.end1;
        var queryContext=$rootScope.queryContext1 == null ? "" : $rootScope.queryContext1;
        var param={userId:userData.userId,orgCode:userData.orgCode,pn:1,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
        //查询状态 ALL=查询所有，TJ=有查询条件，SX筛选查询
        $rootScope.queryStatus1="ALL"
        Init.iwbhttp('/statistics/queryTransferPlanList', param, function(data,header,config,status){
            if(data.resFlag == 0){
                $scope.items = data.list;
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pageNum=1;
                if($scope.items == ""){
                    $scope.listIsNull1 = 0;
                    $scope.isTrue1=0;
                    Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                }else{
                    $scope.listIsNull1 = 1;
                    if($scope.pageNum == $scope.totalPage)
                    {
                        $scope.isTrue1=0;
                    }
                    else
                    {
                        $scope.isTrue1=1;
                    }
                    Alert.myToastBottom({mess:"查出"+data.totalRow+"条记录",height:-160});
                    $ionicScrollDelegate.scrollTop();
                }
            }else{
                Alert.myToastBottom({mess:data.msg,height:-160});
            }
            //LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };

    //翻页查询方法
    $scope.pageRefresh = function(){
        if($scope.pageNum < $scope.totalPage)
        {
            //LoadUtil.showLoad('加载中');
            $scope.isTrue1=0;
            var queryStatus=$rootScope.state1 == null ? "" :$rootScope.state1;
            var begDate=$rootScope.beg1 == null ? "" : $rootScope.beg1;
            var endDate=$rootScope.end1 == null ? "" : $rootScope.end1;
            var queryContext=$rootScope.queryContext1 == null ? "" : $rootScope.queryContext1;
            $scope.pageNum =  $scope.pageNum +1;
            var param={userId:userData.userId,orgCode:userData.orgCode,pn:$scope.pageNum,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
            Init.iwbhttp('/statistics/queryTransferPlanList', param, function(data,header,config,status){
                if(data.resFlag == 0){
                    var items_temp = data.list;
                    $scope.totalPage = parseInt(data.totalPage);
                    angular.forEach(items_temp,function(value,i){
                        $scope.items.push(value);
                    });
                    if(items_temp == ""){
                        $scope.isTrue1=0;
                        Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                    }else{
                        $scope.isTrue1=1;
                        if($scope.pageNum == $scope.totalPage)
                        {
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

    //查询转移计划详细信息事件
    $scope.listInfo = function(obj){
        //$ionicViewSwitcher.nextDirection('forward');
        BackUtil.addBackInfo({data:{level:1,backUrl:$state.current.name}});
        $state.go('search_Tab02Detail',{data:{tpId:obj}});
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

    //调用精准查询页面
    $scope.queryInfo = function(){
        //$ionicViewSwitcher.nextDirection('forward');
        //$rootScope.amId = obj;
        $rootScope.queryType=1;
        BackUtil.addBackInfo({data:{level:1,backUrl:$state.current.name}});
        $state.go('search_query');
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

    //协议状态长按事件
    $scope.onHold = function(id,status){
        //长度超过4位显示不全才会弹出显示
        if(status.length>4)
        {
            $("#"+id).css('display','block');
        }
    };

    //协议状态长按松手隐藏事件
    $scope.onRelease = function(id){
        $("#"+id).css('display','none');
    };

    //页面初始化
    if($rootScope.queryStatus1 != undefined)
    {
        if($rootScope.queryContext1 != undefined)
        {
            //$("#queryInput1").val($rootScope.queryContext1);
        }
        if($rootScope.beg1 != null)
        {
            $("#begDate1").val($rootScope.beg1);
        }
        if($rootScope.end1 != null)
        {
            $("#endDate1").val($rootScope.end1);
        }
        if($rootScope.state1 != null)
        {
            $("#status1").val($rootScope.state1);
        }
        $scope.doRefresh();
    }
}]);


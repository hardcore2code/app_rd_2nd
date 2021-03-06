angular.module('myapp').controller('Tab03Ctrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil) {
    var beg=null;
    var end=null;
    var queryStatus=null;
    var userData=LoginFilter.loginFilter();
    $scope.listIsNull2=0;
    Init.dicthttp("TB_STATUS",function(data,header,config,status){
        $scope.dicts=data.list;
    },function(data,header,config,status){
    });

    $scope.toggleRight = function(param) {
        if(param)
        {
            $("#status2").val(queryStatus);
        }
        $ionicSideMenuDelegate.toggleRight(param);
    };

    $scope.sx = function() {
        if(beg != null && end != null && beg>end)
        {
            Alert.alertTemplate({title:"筛选提示",content:"周期起始日必须小于等于周期终止日！"});
            return;
        }
        $rootScope.queryStatus2="SX"
        $scope.toggleRight(false);
        $scope.doRefresh();
    };

    $scope.clearParam = function() {
        $("#begDate2").val("点击选择日期");
        beg=null;
        $("#endDate2").val("点击选择日期");
        end=null;
        $("#status2").val(null);
    };

    $scope.openDatePickerOne = function (type) {
        var currYear=new Date().getFullYear();
        var begYear=currYear-10;
        var endYear=currYear+10;
        var ipObj1 = {
            callback: function (val) {  //Mandatory
                var date=new Date(val);
                var year=date.getFullYear();
                var month=date.getMonth() < 9 ? "0"+(date.getMonth()+1) :(date.getMonth()+1);
                var day=date.getDate() < 10 ? "0"+date.getDate() :date.getDate();
                if(type == 1)
                {
                    $("#begDate2").val(year+ "-" + month + "-" + day);
                    beg=date;
                }
                else if (type == 2)
                {
                    $("#endDate2").val(year + "-" + month + "-" + day);
                    end=date;
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
        ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.doRefresh = function() {
        if(Init.connectionTest()) return;
        LoadUtil.showLoad('加载中');
        queryStatus=$("#status2").val() == "" ? "" : $("#status2").val();
        var begDate=$("#begDate2").val() == "点击选择日期" ? "" : $("#begDate2").val();
        var endDate=$("#endDate2").val() == "点击选择日期" ? "" : $("#endDate2").val();
        var queryContext=$rootScope.queryContext2 == null ? "" : $rootScope.queryContext2;
        var param={userId:userData.userId,orgCode:userData.orgCode,pn:1,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
        //查询状态 ALL=查询所有，TJ=有查询条件，SX筛选查询
        $rootScope.queryStatus2="ALL"
        Init.iwbhttp('/statistics/queryTransferplanBillList', param, function(data,header,config,status){
            if(data.resFlag == 0){
                $scope.items = data.list;
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pageNum=1;
                if($scope.items == "" ){
                    $scope.listIsNull2 = 0;
                    $scope.isTrue2=0;
                    Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                }else{
                    $scope.listIsNull2 = 1;
                    if($scope.pageNum == $scope.totalPage)
                    {
                        $scope.isTrue2=0;
                    }
                    else
                    {
                        $scope.isTrue2=1;
                    }
                    Alert.myToastBottom({mess:"查出"+data.totalRow+"条记录",height:-160});
                }
            }else{
                Alert.myToastBottom({mess:data.msg,height:-160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.pageRefresh = function(){
        if($scope.pageNum < $scope.totalPage)
        {
            if(Init.connectionTest()) return;
            LoadUtil.showLoad('加载中');
            $scope.isTrue2=0;
            queryStatus=$("#status2").val() == "" ? "" : $("#status2").val();
            var begDate=$("#begDate2").val() == "点击选择日期" ? "" : $("#begDate2").val();
            var endDate=$("#endDate2").val() == "点击选择日期" ? "" : $("#endDate2").val();
            var queryContext=$rootScope.queryContext2 == null ? "" : $rootScope.queryContext2;
            $scope.pageNum =  $scope.pageNum +1;
            var param={userId:userData.userId,orgCode:userData.orgCode,pn:$scope.pageNum,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
            Init.iwbhttp('/statistics/queryTransferplanBillList', param, function(data,header,config,status){
                if(data.resFlag == 0){
                    var items_temp = data.list;
                    $scope.totalPage = parseInt(data.totalPage);
                    angular.forEach(items_temp,function(value,i){
                        $scope.items.push(value);
                    });
                    if(items_temp == ""){
                        $scope.isTrue2=0;
                        Alert.myToastBottom({mess:"未查询到数据！",height:-160});
                    }else{
                        $scope.isTrue2=1;
                        if($scope.pageNum == $scope.totalPage)
                        {
                            Alert.myToastBottom({mess:"已到末页！",height:-160});
                        }
                    }
                }else{
                    Alert.myToastBottom({mess:data.msg,height:-160});
                }
                LoadUtil.hideLoad();
            },function(data,header,config,status){
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.listInfo = function(obj){
        $ionicViewSwitcher.nextDirection('forward');
        BackUtil.addBackInfo({data:{level:1,backUrl:$state.current.name}});
        $state.go('search_Tab03Detail',{data:{tbId:obj}});
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

    $scope.queryInfo = function(){
        $ionicViewSwitcher.nextDirection('forward');
        //$rootScope.amId = obj;
        $rootScope.queryType=2;
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

    $scope.onHold = function(id,status){
        if(status.length>4)
        {
            $("#"+id).css('display','block');
        }
    };

    $scope.onRelease = function(id){
        $("#"+id).css('display','none');
    };

    //if($rootScope.queryStatus2 != undefined)
    //{
    //    if($rootScope.queryContext2 != undefined)
    //    {
    //        $("#queryInput2").val($rootScope.queryContext2);
    //    }
    //    $scope.doRefresh();
    //}
}]);


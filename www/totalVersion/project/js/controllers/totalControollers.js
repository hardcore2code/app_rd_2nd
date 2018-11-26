angular.module('myapp').controller('TodoListCtrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil) {
    var userData=LoginFilter.loginFilter();
    var checkLevel="01";
    var checkLevelName="区级审批";
    $rootScope.checkStatus=true;
    if(userData.orgId == 172)
    {
        checkLevel="02";
        checkLevelName="市级审批";
    }
    $scope.doRefresh = function() {
        if(Init.connectionTest()) return;
        LoadUtil.showLoad('加载中');
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
            LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.pageRefresh = function(){
        if($scope.pageNum < $scope.totalPage)
        {
            if(Init.connectionTest()) return;
            LoadUtil.showLoad('加载中');
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
                LoadUtil.hideLoad();
            },function(data,header,config,status){
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.listInfo = function(processinstid,workItemId){
        $ionicViewSwitcher.nextDirection('forward');
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

    $scope.doRefresh();
}]).controller('TodoListDetailCtrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','$ionicPopup','Alert','LoginFilter','BackUtil','LoadUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,$ionicPopup,Alert,LoginFilter,BackUtil,LoadUtil,LoadUtil) {
    console.log('$stateParams======'+JSON.stringify($stateParams));
    var processinstid = $stateParams.data.processinstId;
    var workItemId = $stateParams.data.workItemId;
    var userData=LoginFilter.loginFilter();
    $scope.lookCheckList = function(tpId)
    {
        $ionicViewSwitcher.nextDirection('forward');
        $stateParams.data.backUrl=$state.current.name;
        $stateParams.data.level=2;
        BackUtil.addBackInfo($stateParams);
        $state.go('todolist-detail-2',{data:{tpId:tpId,processinstid:processinstid,workItemId:workItemId}});
    };

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
            Alert.alertTemplate({title:alt+"提示",content:"驳回理由的长度必须小于等于20个字符！"});
            return;
        }
        if(Init.connectionTest()) return;
        LoadUtil.showLoad(alt+'中');
        var param={componentName:"com.service.refusedisposal.transferplan.apply",logicFlowName:"appCallApprove",userId:userData.userId
            ,userName:userData.userName,orgCode:userData.orgCode,orgSeq:userData.orgSeq,operatorId:userData.operatorId
            ,orgId:userData.orgId,orgName:userData.orgName,realName:userData.realName,empId:userData.empId,
            paramsMap:{workitemid: workItemId,processinstid:processinstid,checkResult:type,checkAdvice:checkRemark}};
        Init.eoshttp(param,function(data,header,config,status){
            if(data.runStatue == 0){
                $("#tg").attr("disabled", "disabled");
                $("#bh").attr("disabled", "disabled");
                $rootScope.checkStatus=false;
                Alert.alertTemplate({title:alt+"提示",content:"审核"+alt+"成功！"});
            }else{
                Alert.alertTemplate({title:alt+"提示",content:"审核"+alt+"失败！"});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
    };

    $scope.myGoBack = function() {
        BackUtil.goBackFun();
    };

    if(Init.connectionTest()) return;
    LoadUtil.showLoad('加载中');
    var param={tpId:"",processinstId:processinstid,userId:userData.userId};
    console.log("param="+JSON.stringify(param));
    Init.iwbhttp('/statistics/getTransferPlanByTpId', param, function(data,header,config,status){
        if(data.resFlag == 0){
            $scope.items = data.entityData.subList;
            $scope.im = data.entityData;
            $scope.hStatus = data.entityData.hStatus;
            console.log("data.entityData===>>"+JSON.stringify(data.entityData));
            $rootScope.isTrue=1;
        }else{
            Alert.myToastBottom({mess:data.msg,height:-160});
            $rootScope.isTrue=0;
        }
        LoadUtil.hideLoad();
    },function(data,header,config,status){
    });

    $scope.showPopup = function(type,alt) {
        $scope.data = {}

        // 自定义弹窗
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-maxlength="20" placeholder="长度必须小于等于20位！" style="font-size: 15px;width: 100%;" ng-model="data.checkRemark">',
            title: '驳回提示',
            subTitle: '请输入驳回原因！',
            scope: $scope,
            buttons: [
                { text: '取消', type: 'button-positive alterButton' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive alterButton',
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
                $scope.checkIng(type,res,alt);
            }
        });
    };

}]).controller('TodoListDetail2Ctrl',['$state','$scope','$rootScope','Init','$ionicViewSwitcher','$stateParams','Alert','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,$stateParams,Alert,LoginFilter,BackUtil,LoadUtil) {
    var itemId = $stateParams.data.tpId;
    var processinstid = $stateParams.data.processinstid;
    var workItemId = $stateParams.data.workItemId;
    var userId=LoginFilter.loginFilter().userId;

    $scope.myGoBack = function() {
        //$ionicViewSwitcher.nextDirection('back');
        //$state.go('todolist-detail',{data:{processinstId:processinstid,workItemId:workItemId}});
        BackUtil.goBackFun();
    };

    if(Init.connectionTest()) return;
    LoadUtil.showLoad('加载中');
    var param={bizId:itemId,userId:userId,ps:999,pn:1};
    console.log("param="+JSON.stringify(param));
    Init.iwbhttp('/statistics/appCallAuditCx', param, function(data,header,config,status){
        if(data.resFlag == 0) {
            $scope.items = data.list;
            $rootScope.isTrue = 1;
        }else{
            Alert.myToastBottom({mess:data.msg,height:-160});
            $rootScope.isTrue = 0;
        }
        LoadUtil.hideLoad();
    },function(data,header,config,status){
    });
}]).controller('SearchCtrl',['$scope','$ionicSlideBoxDelegate','$rootScope','$ionicSideMenuDelegate',function($scope,$ionicSlideBoxDelegate,$rootScope,$ionicSideMenuDelegate) {

    $scope.mySlide = {
        "height" : $rootScope.contextHeight+"px"
    };
    $scope.tabNames=['处置协议','转移计划','转移联单'];
    $scope.pages=["tab01.html","tab02.html",
        "tab03.html"];
    $scope.slectIndex=0;
    $scope.activeSlide=function(index){//点击时候触发
        $scope.slectIndex=index;
        $ionicSlideBoxDelegate.slide(index);
        $ionicSideMenuDelegate.toggleRight(false);
    };
    $scope.slideChanged=function(index){//滑动时候触发
        //向右滑
        var tabNames_LastIndex = $scope.tabNames.length-1;
        var width = document.body.offsetWidth;
        if($scope.slectIndex < index)
        {
            if(index>1 && index<tabNames_LastIndex)
            {
                var left = $scope.slectIndex*width*0.3;
                $("#tab-search-header-tab").scrollLeft(left);
            }
        }
        else  //向左滑
        {
            if(index>0 && index<tabNames_LastIndex-1)
            {
                var left = (index-1)*width*0.3;
                $("#tab-search-header-tab").scrollLeft(left);
            }
        }
        $ionicSideMenuDelegate.toggleRight(false);
        $scope.slectIndex=index;
    };

    var queryType=$rootScope.queryType == null ? 0 : $rootScope.queryType;
    $scope.slideIndex = queryType;
    $scope.activeSlide(queryType);
}]).controller('loginCtrl',['$scope','$rootScope','$state','Alert','localStorageService','Init','$ionicLoading','$timeout','$ionicPopup','LoadUtil',function($scope,$rootScope,$state,Alert,localStorageService,Init,$ionicLoading,$timeout,$ionicPopup,LoadUtil) {

    if(localStorageService.get("userData") != null)
    {
        $state.go("tab.search");
    }

    $scope.login = function(){
        $("#dbx").show();
        var name=$("#username").val();
        var pwd=$("#pwd").val();
        if(name == null || name == ""){
            Alert.alertTemplate({title:"登录提示",content:"请输入用户名"});
            return;
        }
        if(pwd == null || pwd == ""){
            Alert.alertTemplate({title:"登录提示",content:"请输入密码"});
            return;
        }
        //if(Init.connectionTest()) return;
        LoadUtil.showLoad('登录中');
        var param={userId:name,pwd:pwd};
        Init.iwbhttp('/statistics/appLogin', param, function(data,header,config,status){
            if(data.resFlag == 0 && data.ifLogin == 0){
                var roleStr=data.roleId;
                var roles=roleStr.split(',');
                var roleArr=[];
                for(var i=0;i<roles.length;i++)
                {
                    roleArr[i]={roleId:roles[i]};
                }
                localStorageService.set('userData',{orgId:data.epId,operatorId:data.operatorId,
                    orgCode:data.orgCode,userId:data.userId,empId:data.empId,userName:data.userName,
                    realName:data.realName,orgName:data.epName,orgSeq:data.orgSeq,roleId:roleArr});
                localStorageService.set('IWBSESSION',data.IWBSESSION);
                $("#username").val("");
                $("#pwd").val("");
                $state.go("tab.search");
            }else{
                Alert.alertTemplate({title:"登录提示",content:data.msg});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
    }

    var count=5;
    $scope.setIpProt=function()
    {
        var toId=null;
        if(count==5)
        {
            toId=window.setTimeout(clearCount,5000);
        }
        if(count==1)
        {
            // 自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '<div class="item item-input item-text">'+
                '<input type="text"  placeholder="普通后台地址" '+
                'style="font-size: 15px;width: 120px;"  ng-model="$root.baseUrl"></div>'+
                '<div class="item item-input item-text">'+
                '<input type="text"   placeholder="普元后台地址" ' +
                'style="font-size: 15px;width: 120px;"  ng-model="$root.baseUrlEos"></div>',
                title: '服务器后台服务器IP端口修改',
                scope: $scope,
                buttons: [
                    { text: '关闭', type: 'button-positive alterButton' }
                ]
            });
        }
        else
        {
            //alert("再点击"+(--count)+"次就可以修改后台服务器地址！");
            Alert.myToastBottom({mess:"再点击"+(--count)+"次就可以修改后台服务器地址！",height:-160});
        }
    }

    function clearCount()
    {
        count=5;
    }
}]).controller('AccountCtrl',['$scope','$rootScope','$state','localStorageService','$ionicPopup','LoginFilter','Init','LoadUtil','Alert',function($scope,$rootScope,$state,localStorageService,$ionicPopup,LoginFilter,Init,LoadUtil,Alert) {

    $scope.userData=LoginFilter.loginFilter();
    $scope.loginOut=function()
    {
        LoadUtil.showLoad('登出中');
        var param={IWBSESSION:localStorageService.get('IWBSESSION')};
        Init.iwbhttp('/user/logout', param, function(data,header,config,status){
            if(data.resFlag == 0){
                localStorageService.set("userData",null);
                $state.go("login");
            }
            Alert.alertTemplate({title:"登出提示",content:data.msg});
            LoadUtil.hideLoad();
        },function(data,header,config,status){
        });
    };

    //  confirm 对话框
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '注销提示',
            template: '您确定要退出登录吗？',
            cancelText:'取消',
            okText:'确定',
            cancelType:'button-positive alterButton',
            okType:'button-positive alterButton'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.loginOut();
            } else {
            }
        });
    };
}]).controller('queryCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','localStorageService','Alert','$ionicPopup','BackUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,localStorageService,Alert,$ionicPopup,BackUtil) {
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
}]).controller('Tab01Ctrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','$ionicLoading','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,$ionicLoading,BackUtil,LoadUtil) {
    var beg=null;
    var end=null;
    var queryStatus=null;
    $scope.listIsNull=0;
    var userData=LoginFilter.loginFilter();
    Init.dicthttp("AM_STATUS",function(data,header,config,status){
        $scope.dicts=data.list;
    },function(data,header,config,status){
    });

    $scope.toggleRight = function(param) {
        if(param)
        {
            $("#status").val(queryStatus);
        }
        $ionicSideMenuDelegate.toggleRight(param);
    };

    $scope.sx = function() {
        if(beg != null && end != null && beg>end)
        {
            Alert.alertTemplate({title:"筛选提示",content:"周期起始日必须小于等于周期终止日！"});
            return;
        }
        $rootScope.queryStatus0="SX"
        $scope.toggleRight(false);
        $scope.doRefresh();
    };

    $scope.clearParam = function() {
        $("#begDate").val("点击选择日期");
        beg=null;
        $("#endDate").val("点击选择日期");
        end=null;
        $("#status").val(null);
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
                    $("#begDate").val(year+ "-" + month + "-" + day);
                    beg=date;
                }
                else if (type == 2)
                {
                    $("#endDate").val(year + "-" + month + "-" + day);
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
        //if(Init.connectionTest()) return;
        LoadUtil.showLoad('加载中');
        queryStatus=$("#status").val() == "" ? "" : $("#status").val();
        var begDate=$("#begDate").val() == "点击选择日期" ? "" : $("#begDate").val();
        var endDate=$("#endDate").val() == "点击选择日期" ? "" : $("#endDate").val();
        var queryContext=$rootScope.queryContext0 == null ? "" : $rootScope.queryContext0;
        var param={userId:userData.userId,orgCode:userData.orgCode,pn:1,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
        //查询状态 ALL=查询所有，TJ=有查询条件，SX筛选查询
        $rootScope.queryStatus0="ALL"
        Init.iwbhttp('/statistics/queryAgreementList', param, function(data,header,config,status){
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
            LoadUtil.hideLoad();
            $scope.$broadcast('scroll.refreshComplete');
        },function(data,header,config,status){
        });
        //Stop the ion-refresher from spinning
    };

    $scope.pageRefresh = function(){
        if($scope.pageNum <  $scope.totalPage)
        {
            if(Init.connectionTest()) return;
            LoadUtil.showLoad('加载中');
            $scope.isTrue=0;
            queryStatus=$("#status").val() == "" ? "" : $("#status").val();
            var begDate=$("#begDate").val() == "点击选择日期" ? "" : $("#begDate").val();
            var endDate=$("#endDate").val() == "点击选择日期" ? "" : $("#endDate").val();
            var queryContext=$rootScope.queryContext0 == null ? "" : $rootScope.queryContext0;
            $scope.pageNum =  $scope.pageNum +1;
            var param={userId:userData.userId,orgCode:userData.orgCode,pn:$scope.pageNum,ps:10,queryContext:queryContext,status:queryStatus,beginDate:begDate,entDate:endDate};
            Init.iwbhttp('/statistics/queryAgreementList', param, function(data,header,config,status){
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
        $state.go('search_Tab01Detail',{data:{amId:obj}});
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
        $rootScope.queryType=0;
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

    //if($rootScope.queryStatus0 != undefined)
    //{
    //    if($rootScope.queryContext0 != undefined)
    //    {
    //        $("#queryInput").val($rootScope.queryContext0);
    //    }
    //    $scope.doRefresh();
    //}
}]).controller('Tab01DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','LoginFilter','$stateParams','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,LoginFilter,$stateParams,BackUtil,LoadUtil) {
    var amId = $stateParams.data.amId;
    var userId=LoginFilter.loginFilter().userId;

    $scope.myGoBack = function() {
        BackUtil.goBackFun();
    };

    $scope.onHold = function(){
        if($scope.im.statusName.length>4)
        {
            $("#"+$scope.im.amId+"detail").css('display','block');
        }
    };

    $scope.onRelease = function(){
        $("#"+$scope.im.amId+"detail").css('display','none');
    };

    if(Init.connectionTest()) return;
    LoadUtil.showLoad('加载中');
    var param={amId:amId,userId:userId};
    Init.iwbhttp('/statistics/getArgeementByAmId', param, function(data,header,config,status){
        if(data.resFlag == 0){
            $scope.items = data.entityData.subList;
            $scope.im = data.entityData;
            console.log("result="+JSON.stringify(data));
            $rootScope.isTrue=1;
        }else{
            Alert.myToastBottom({mess:data.msg,height:-160});
            $rootScope.isTrue=0;
        }
        LoadUtil.hideLoad();
    },function(data,header,config,status){
    });
}]).controller('Tab02Ctrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil) {
    var beg=null;
    var end=null;
    var queryStatus=null;
    var userData=LoginFilter.loginFilter();
    $scope.listIsNull1=0;
    Init.dicthttp("TP_STATUS",function(data,header,config,status){
        $scope.dicts=data.list;
    },function(data,header,config,status){
    });

    $scope.toggleRight = function(param) {
        if(param)
        {
            $("#status1").val(queryStatus);
        }
        $ionicSideMenuDelegate.toggleRight(param);
    };

    $scope.sx = function() {
        if(beg != null && end != null && beg>end)
        {
            Alert.alertTemplate({title:"筛选提示",content:"周期起始日必须小于等于周期终止日！"});
            return;
        }
        $rootScope.queryStatus1="SX"
        $scope.toggleRight(false);
        $scope.doRefresh();
    };

    $scope.clearParam = function() {
        $("#begDate1").val("点击选择日期");
        beg=null;
        $("#endDate1").val("点击选择日期");
        end=null;
        $("#status1").val(null);
    };

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
                    beg=date;
                }
                else if (type == 2)
                {
                    $("#endDate1").val(year + "-" + month + "-" + day);
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
        ionicDatePicker.openDatePicker(ipObj2);
    };

    $scope.doRefresh = function() {
        if(Init.connectionTest()) return;
        LoadUtil.showLoad('加载中');
        queryStatus=$("#status1").val() == "" ? "" : $("#status1").val();
        var begDate=$("#begDate1").val() == "点击选择日期" ? "" : $("#begDate1").val();
        var endDate=$("#endDate1").val() == "点击选择日期" ? "" : $("#endDate1").val();
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
            $scope.isTrue1=0;
            queryStatus=$("#status1").val() == "" ? "" : $("#status1").val();
            var begDate=$("#begDate1").val() == "点击选择日期" ? "" : $("#begDate1").val();
            var endDate=$("#endDate1").val() == "点击选择日期" ? "" : $("#endDate1").val();
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
                LoadUtil.hideLoad();
            },function(data,header,config,status){
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.listInfo = function(obj){
        $ionicViewSwitcher.nextDirection('forward');
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

    $scope.queryInfo = function(){
        $ionicViewSwitcher.nextDirection('forward');
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

    $scope.onHold = function(id,status){
        if(status.length>4)
        {
            $("#"+id).css('display','block');
        }
    };

    $scope.onRelease = function(id){
        $("#"+id).css('display','none');
    };

    //if($rootScope.queryStatus1 != undefined)
    //{
    //    if($rootScope.queryContext1 != undefined)
    //    {
    //        $("#queryInput1").val($rootScope.queryContext1);
    //    }
    //    $scope.doRefresh();
    //}
}]).controller('Tab02DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,$stateParams,LoginFilter,BackUtil,LoadUtil) {
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
}]).controller('Tab03Ctrl', ['$scope','$rootScope','Init','$state','$ionicViewSwitcher','$ionicHistory','$timeout','$ionicSideMenuDelegate','ionicDatePicker','localStorageService','LoginFilter','Alert','BackUtil','LoadUtil',function ($scope,$rootScope,Init,$state,$ionicViewSwitcher,$ionicHistory,$timeout,$ionicSideMenuDelegate,ionicDatePicker,localStorageService,LoginFilter,Alert,BackUtil,LoadUtil) {
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
}]).controller('Tab03DetailCtrl', ['$state','$scope','$rootScope','Init','$ionicViewSwitcher','Alert','$stateParams','LoginFilter','BackUtil','LoadUtil',function ($state,$scope,$rootScope,Init,$ionicViewSwitcher,Alert,$stateParams,LoginFilter,BackUtil,LoadUtil) {
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
}])
;
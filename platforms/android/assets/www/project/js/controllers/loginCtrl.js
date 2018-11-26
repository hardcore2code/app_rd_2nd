/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('loginCtrl',['$scope','$rootScope','$state','Alert','localStorageService','Init','$ionicLoading','$timeout','$ionicPopup','LoadUtil',function($scope,$rootScope,$state,Alert,localStorageService,Init,$ionicLoading,$timeout,$ionicPopup,LoadUtil) {

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
                $state.go("tab.todolist");
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
}])
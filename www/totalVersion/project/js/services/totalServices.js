/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('Alert', ['$ionicPopup',function($ionicPopup){
    var alertRes = {
        alertTemplate : function(data){
            $ionicPopup.alert({
                title: data.title,
                template: '<div align="center">'+data.content+'</div>',
                okType: 'button-positive alterButton',
                okText:'确定',
            }).then(function (res) {
            });
        },
        myToastBottom : function(data){
            window.plugins.toast.showWithOptions(
                {
                    message: data.mess,
                    duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                    position: "bottom",
                    addPixelsY: data.height  // added a negative value to move it up a bit (default 0)
                },
                function (){
                }, // optional
                function (){
                }
            )
        }
    };
    return alertRes;
}]).factory('BackUtil', ['$rootScope','$state','$ionicViewSwitcher',function($rootScope,$state,$ionicViewSwitcher){
    var alertRes = {
        addBackInfo : function(data){
            $rootScope.barkInfoArray[$rootScope.barkInfoArray.length]=data;
        },
        goBackFun : function(){
            $ionicViewSwitcher.nextDirection('back');
            var index=$rootScope.barkInfoArray.length-1;
            var path=$rootScope.barkInfoArray[index].data.backUrl;
            var param=$rootScope.barkInfoArray[index]
            $rootScope.barkInfoArray.pop();
            if(param.data.level == 1)
            {
                $state.go(path);
            }
            else
            {
                $state.go(path,param);
            }
        }
    };
    return alertRes;
}]).factory('Init', ['$http','$rootScope','localStorageService','LoginFilter','Alert','LoadUtil',function($http,$rootScope,localStorageService,LoginFilter,Alert,LoadUtil){

    var myhttp = function(url,data,success,error){
        data['IWBSESSION'] = localStorageService.get('IWBSESSION');
        //data['DEVICE_UUID'] = $rootScope.uuid;
        data['DEVICE_UUID'] = 1;
        //data['DEVICE_UUID'] = 1;
        //console.log("params="+JSON.stringify(data));
        $http({
            url:$rootScope.baseUrl+$rootScope.baseUrlPath+url,
            data: "params="+JSON.stringify(data),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST'
            //method:'GET'
        }).success(function(data,header,config,status){
            console.log('========success==============');
            //console.log("result="+JSON.stringify(data));
            // localStorageService.set('IWBSESSION',data.IWBSESSION);
            // userInit(data);
            success(data,header,config,status);
        }).error(function(data,header,config,status){
            console.log('========error==============');
            LoadUtil.hideLoad();
            Alert.myToastBottom({mess:"发生未知异常，请稍后再试！",height:-160});
            error(data,header,config,status);
        });
    };
    var myhttpEos = function(url,data,success,error){
        data['IWBSESSION'] = localStorageService.get('IWBSESSION');
        data['DEVICE_UUID'] = $rootScope.uuid;
        //console.log("params="+JSON.stringify(data));
        $http({
            url:$rootScope.baseUrlEos+$rootScope.baseUrlPathEos+url,
            data: "params="+JSON.stringify(data),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST'
            //method:'GET'
        }).success(function(data,header,config,status){
            console.log('========success==============');
            //console.log("result="+JSON.stringify(data));
            // localStorageService.set('IWBSESSION',data.IWBSESSION);
            // userInit(data);
            success(data,header,config,status);
        }).error(function(data,header,config,status){
            console.log('========error==============');
            LoadUtil.hideLoad();
            Alert.myToastBottom({mess:"发生未知异常，请稍后再试！",height:-160});
            error(data,header,config,status);
        });
    };

    var initRes = {
        iwbhttp : function(url,data,success,error){
            myhttp(url,data,success,error);
        },
        eoshttp : function(data,success,error){
            myhttpEos('',data,success,error);
        },
        dicthttp : function(dictId,success,error){
            var param={dictTypeId:dictId,userId:LoginFilter.loginFilter().userId};
            myhttp('/statistics/getDicts',param,success,error);
        },
        connectionTest : function(){
            if(navigator.connection.type == "none")
            {
                Alert.myToastBottom({mess:"您的网络异常，请调整好网络后再试！",height:-160});
                return true;
            }
            return false;
        }
    };
    return initRes;
}]).factory('LoadUtil', ['$ionicLoading',function($ionicLoading){
    var alertRes = {
        showLoad : function(text){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-stable"></ion-spinner><h6>'+text+'...</h6>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        },
        hideLoad : function(){
            $ionicLoading.hide();
        }
    };
    return alertRes;
}]).factory('LoginFilter', ['localStorageService','$state',function(localStorageService,$state){
    var alertRes = {
        loginFilter : function(){
            var userData=localStorageService.get("userData");
            //console.log("userData="+JSON.stringify(userData));
            if(userData == undefined || userData == null )
            {
                $state.go("login");
            }
            else
            {
                return userData;
            }
        }
    };
    return alertRes;
}]);
//修改编码


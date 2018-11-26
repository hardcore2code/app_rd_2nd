/**
 * Created by woody on 2015/10/7.
 */
angular.module('myapp').factory('Init', ['$http','$rootScope','localStorageService','LoginFilter','Alert','LoadUtil',function($http,$rootScope,localStorageService,LoginFilter,Alert,LoadUtil){

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
}]);
//修改编码
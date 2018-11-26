/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('BackUtil', ['$rootScope','$state','$ionicViewSwitcher',function($rootScope,$state,$ionicViewSwitcher){
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
}]);
//修改编码


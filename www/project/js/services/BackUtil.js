/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('BackUtil', ['$rootScope','$state','$ionicViewSwitcher','$ionicNativeTransitions',function($rootScope,$state,$ionicViewSwitcher,$ionicNativeTransitions){
    var alertRes = {
        addBackInfo : function(data){
            $rootScope.barkInfoArray[$rootScope.barkInfoArray.length]=data;
        },
        goBackFun : function(){
            //$ionicViewSwitcher.nextDirection('back');
            var index=$rootScope.barkInfoArray.length-1;
            var path=$rootScope.barkInfoArray[index].data.backUrl;
            var param=$rootScope.barkInfoArray[index]
            $rootScope.barkInfoArray.pop();
            if(param.data.level == 1)
            {
                $ionicNativeTransitions.stateGo(path, {}, {}, {
                    "type": "slide",
                    "direction" : "right"
                });
                //$state.go(path);
            }
            else
            {
                $ionicNativeTransitions.stateGo(path, param, {}, {
                    "type": "slide",
                    "direction" : "right"
                });
            }
        }
    };
    return alertRes;
}]);
//修改编码


/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('LoginFilter', ['localStorageService','$state',function(localStorageService,$state){
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


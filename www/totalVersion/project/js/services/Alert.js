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
}]);
//修改编码


/**
 * Created by admin on 2017/5/10.
 */
angular.module('myapp').filter('StyleUtil', function() { //����ע������
    return function(text) {
        var resultStyle = {
            "width" : "65px"
        };
        if(text == undefined)
        {

        }else
        {
            if(text.length > 3)
            {
                resultStyle = {
                    "width" : "85px"
                };
            }
        }
        return resultStyle;
    }
});


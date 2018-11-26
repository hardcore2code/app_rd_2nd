/**
 * Created by admin on 2017/5/10.
 */
angular.module('myapp').filter('StringUtil', function() { //可以注入依赖
    return function(text,len) {
        var result="";
        if(text == undefined)
        {

        }else
        {
            result=text;
            text=text.replace("(","").replace(")","");
            if(text.length > len)
            {
                result=text.substr(0,len)+"...";
            }
        }
        return result;
    }
}).filter('StyleUtil', function() { //可以注入依赖
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


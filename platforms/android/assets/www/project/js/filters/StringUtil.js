/**
 * Created by admin on 2017/5/10.
 */
angular.module('myapp').filter('StringUtil', function() { //¿ÉÒÔ×¢ÈëÒÀÀµ
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
});


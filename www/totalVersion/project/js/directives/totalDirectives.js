/*
create by woody
date 20170303
二级页面隐藏底部tab栏
*/
angular.module('myapp').directive('showContext', function($rootScope) {
  return{
    restrict:'EAC',
    template: function(tElement,tAttrs){
      var _html = '';
      _html +=  '<a id="'+tAttrs.divid+'" href="#" class="clip-border" style="display: none;'+
                'position: absolute;'+
                '-webkit-clip-path: polygon(100% 0%, 100% 80%, 56% 80%, 50% 100%, 44% 80%, 0% 80%, 0% 0%);'+
                'clip-path: polygon(100% 0%, 100% 80%, 56% 80%, 50% 100%, 44% 80%, 0% 80%, 0% 0%);'+
                '-webkit-transition: all 0.2s ease-in;'+
                'transition: all 0.2s ease-in;'+
                'margin: 0 auto;'+
                'background-color:#a5a4a4;'+
                'margin-top:'+tAttrs.mtop+'%;'+
                'margin-left:'+tAttrs.mleft+'%;'+
                'width: '+tAttrs.width+'px;'+
                'height: '+tAttrs.height+'px;'+
                'z-index: 12;">'+
                '<div style="z-index: 13;color: #6d4b76;font-size: 12px;padding:4px 4px;width: 100%;position: absolute;text-align: left;">'+tAttrs.ctt+'</div>'+
                '</a>';
      replace:true;
      return _html;
    }
  };  
}).directive('showContextCss', function($rootScope) {
    return{
        restrict:'EAC',
        template: function(tElement,tAttrs){
            var _html = '';
            _html += '<style type="text/css">'+
                '.clip-border {'+
                '}'+

                '.clip-border::after {'+
                'content: "";'+
                'position: absolute;'+
                'top: 1px;'+
                'left: 1px;'+
                'right: 1px;'+
                'bottom: 1px;'+
                'margin: 0 auto;'+
                'background-color:#c2bacd;'+
                '-webkit-transition: all 0.3s linear;'+
                'transition: all 0.3s linear;'+
                '-webkit-clip-path: polygon(100% 0%, 100% 80%, 56% 80%, 50% 100%, 44% 80%, 0% 80%, 0% 0%);'+
                'clip-path: polygon(100% 0%, 100% 80%, 56% 80%, 50% 100%, 44% 80%, 0% 80%, 0% 0%);'+
                'z-index: 11;'+
                '}'+
                '</style>';
            replace:true;
            return _html;
        }
    };
})
;
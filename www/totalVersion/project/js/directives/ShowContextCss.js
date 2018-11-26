/*
create by woody
date 20170303
二级页面隐藏底部tab栏
*/
angular.module('myapp').directive('showContextCss', function($rootScope) {
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
}); 
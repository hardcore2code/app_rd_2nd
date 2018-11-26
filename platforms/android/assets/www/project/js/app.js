/*
 created by woody
 date 2017-03-01
 程序入口,引用第三方库,配置路由,http拦截器
 */
var myapp = angular.module('myapp', ['ionic', 'LocalStorageModule','ngCordova','ionic-datepicker','ionic-native-transitions'])
myapp.filter('reverse', function() { //可以注入依赖
  return function(text) {
    return text.split("").reverse().join("");
  }
});
myapp.config(['$httpProvider','$stateProvider', '$urlRouterProvider','$ionicConfigProvider','$ionicNativeTransitionsProvider',function($httpProvider,$stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicNativeTransitionsProvider) {
  $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 400, // in milliseconds (ms), default 400,
      slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
      iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
      androiddelay: -1, // same as above but for Android, default -1
      winphonedelay: -1, // same as above but for Windows Phone, default -1,
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
      triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
      backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  });
  $ionicConfigProvider.views.transition('no');
  $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'slide',
      direction: 'left'
  });
  $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
  });
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $stateProvider.state('tab', {
    url: '/tab',
    cache:'false',
    abstract: true,
    templateUrl: 'project/templates/tabs.html'
  })
    // Each tab has its own nav history stack:
      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'project/templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('search_query', {
        url: '/queryPage',
        cache:'false',
        templateUrl: 'project/templates/search_tabs/query.html',
        controller: 'queryCtrl',
        params: {'data': null}
      })
      .state('search_Tab01Detail', {
        url: '/detail01',
        cache:'false',
        templateUrl: 'project/templates/search_tabs/tab01Detail.html',
        controller: 'Tab01DetailCtrl',
        params: {'data': null}
      })
      .state('search_Tab02Detail', {
        url: '/detail02',
        cache:'false',
        templateUrl: 'project/templates/search_tabs/tab02Detail.html',
        controller: 'Tab02DetailCtrl',
        params: {'data': null}
      })
      .state('search_Tab03Detail', {
        url: '/detail03',
        cache:'false',
        templateUrl: 'project/templates/search_tabs/tab03Detail.html',
        controller: 'Tab03DetailCtrl',
        params: {'data': null}
      })
      .state('tab.todolist', {
        url: '/todolist',
        cache:'false',
        views: {
          'tab-todolist': {
            templateUrl: 'project/templates/tab-todolist.html',
            controller: 'TodoListCtrl'
          }
        }
      })
      .state('todolist-detail', {
        url: '/todolistDetail01',
        cache:'false',
        templateUrl: 'project/templates/tab_todolist/detail.html',
        controller: 'TodoListDetailCtrl',
        params: {'data': null}
      })
      .state('todolist-detail-2', {
        url: '/todolistDetail02',
        templateUrl: 'project/templates/tab_todolist/detail_2.html',
        controller: 'TodoListDetail2Ctrl',
        params: {'data': null}
      })
      .state('tab.account', {
        url: '/account',
        cache:'false',
        views: {
          'tab-account': {
            templateUrl: 'project/templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'project/templates/login.html',
        controller: 'loginCtrl'
      })
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/login');
  //http
  $httpProvider.interceptors.push(['$rootScope',function($rootScope){
    return {
      'request':function(config){
        return config;
      },
      'response': function (config) {
        return config;
      }
    };
  }]);

}]);
/*
 created by woody
 date 2017-03-01
 启动程序
 配置基本变量
 */
myapp.run(['$ionicPlatform','$state','$rootScope','localStorageService','$cordovaDevice', '$ionicHistory','$location','$cordovaKeyboard','Alert','BackUtil','LoginFilter',function($ionicPlatform,$state,$rootScope,localStorageService,$cordovaDevice, $ionicHistory,$location,$cordovaKeyboard,Alert,BackUtil,LoginFilter) {
  document.addEventListener("deviceready", function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.device = $cordovaDevice.getDevice();
    $rootScope.uuid = $cordovaDevice.getUUID();
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //物理返回按钮控制&双击退出应用
    $ionicPlatform.registerBackButtonAction(function(e) {
      //判断处于哪个页面时双击退出
      var path=$location.path().substr(0,4);
      if ($location.path() != "") {
        if (path == '/tab' || $location.path() == '/login') {
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            Alert.myToastBottom({mess:"再按一次退出系统！",height:-160});
            setTimeout(function() {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
          }
        }
        else
        {
          BackUtil.goBackFun()
        }
      } else if ($ionicHistory.backView()) {
        if ($cordovaKeyboard.isVisible()) {
          $cordovaKeyboard.close();
        } else {
          $ionicHistory.goBack();
        }
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        Alert.myToastBottom({mess:"再按一次退出系统！",height:-160});
        setTimeout(function() {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);

    //$rootScope.baseUrlEos = 'http://192.168.0.48:8089';
    //$rootScope.baseUrlPathEos = '/RefuseDisposal/servlet/AppServlet';
    //$rootScope.baseUrl = 'http://192.168.0.48:9001';
    //$rootScope.baseUrlPath = '';
    //$rootScope.hideTabs = '';
    //$rootScope.loadData = "请下拉刷新查看数据！";
    //$rootScope.contextHeight =window.screen.height - 48 - 44 - 10;
    //$rootScope.checkStatus=true;
    ////console.log("网页可见区域高"+document.body.clientHeight);
    ////console.log("网页可见区域高"+document.body.offsetHeight);
    ////console.log("网页正文全文高"+screen.height);
    ////console.log("屏幕分辨率的高"+window.screen.height);
    ////console.log("屏幕可用工作区高度"+window.screen.availHeight);
    //$rootScope.const = {
    //  tab1:{
    //    header_title:'查询',
    //    tab_title:'查询'
    //  },
    //  tab2:{
    //    header_title:'审批',
    //    tab_title:'审批'
    //  },
    //  tab3:{
    //    header_title:'设置',
    //    tab_title:'设置'
    //  }
    //};
    //$rootScope.queryTitle="查询";
    //$rootScope.barkInfoArray=[];
    //
    //if(LoginFilter.loginFilter() != null)
    //{
    //  $state.go("tab.todolist");
    //}

    //alert(window.devicePixelRatio);
  },false);

  $rootScope.baseUrlEos = 'http://192.168.0.200:8089';
  $rootScope.baseUrlPathEos = '/RefuseDisposal/servlet/AppServlet';
  $rootScope.baseUrl = 'http://192.168.0.200:9016/rd_2nd';
  $rootScope.baseUrlPath = '';
  $rootScope.hideTabs = '';
  $rootScope.loadData = "请下拉刷新查看数据！";
  $rootScope.contextHeight =document.body.scrollHeight - 48 - 44;
  $rootScope.checkStatus=true;
  $rootScope.const = {
    tab1:{
      header_title:'查询',
      tab_title:'查询'
    },
    tab2:{
      header_title:'审批',
      tab_title:'审批'
    },
    tab3:{
      header_title:'设置',
      tab_title:'设置'
    }
  };
  $rootScope.queryTitle="查询";
  $rootScope.barkInfoArray=[];

  if(LoginFilter.loginFilter() != null)
  {
    $state.go("tab.todolist");
  }
}])

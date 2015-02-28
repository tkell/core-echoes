var coreEchoesApp = angular.module('coreEchoesApp', []);

coreEchoesApp.controller('echoController', function ($scope) {
  $scope.echoes = [
    {'ip': '192.168.1.10'},
    {'ip': '121.17.19.10'},
  ];
});
var request = require('request');
var Q = require('q');

var Throttle = require('./throttle.js');

var throttle = new Throttle(2, 10000);

var asyncRequest = function (action, resource, data) {
  var deferred = Q.defer();

  var randTimeout = Math.floor(Math.random()*200);

  var apiCall = function () {
    deferred.resolve({
      action: action,
      resource: resource,
      data: data
    });
  };

  throttle.add(setTimeout.bind(null, apiCall, randTimeout));

  return deferred.promise;
}

// generate requests

  var promises1 = [];

for (var i = 0; i < 3; i++) {
  promises1.push(asyncRequest("create","People", {please:"please"}));
}

var now1 = new Date().getTime();

Q.all(promises1).then(function (results) {
  var doneTime1 = new Date().getTime();
  console.log("elapsed time: " + (doneTime1 - now1));
  console.log("calls: " + i);
});

var promises2 = [];

for (var i = 0; i < 3; i++) {
  promises2.push(asyncRequest("create","People", {please:"please"}));
}

var now2 = new Date().getTime();

Q.all(promises2).then(function (results) {
  var doneTime2 = new Date().getTime();
  console.log("elapsed time: " + (doneTime2 - now2));
  console.log("calls: " + i);
});
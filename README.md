# Throttle

Throttle is a utility made to interface with APIs that have a "max requests per some amount of time" limitation. Requests are sent off in constant intervals until all requests have been processed.

## Variatic add

The primary method of adding functions to the throttle is to call the add function passing in a reference to the function as well as the arguments to that function.

```javascript
// @param {int} requestCount  number of requests to be made
// @param {int} perMs         duration of time that the above number of requests can be made in
var throttle = new Throttle(int, int);
throttle.add(asyncFunction, asyncFunctionArgument1, asyncFunctionArgument2, ...);
```

## Usage

```javascript
var Throttle = require('throttle');
var throttle = new Throttle(200, 60000);

var asyncRequest = function (action, resource, data) {
  var deferred = Q.defer();

  var randTimeout = Math.floor(Math.random()*200);

  var apiCall = function (action, resource, data) {
    setTimeout(function() {
      deferred.resolve({
        action: action,
        resource: resource,
        data: data
      });
    }, randTimeout)
  };

  throttle.add(apiCall, action, resource, data);

  return deferred.promise;
}
```

## Release History

* 0.0.2 Initial release
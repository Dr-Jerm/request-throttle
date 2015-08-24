var Q = require('q');

var Throttle = function (requestCount, perMs) {

  var bucket = [];

  var timeBetweenRequests = perMs / requestCount;

  var throttleTimer = null;

  /**
   * STATUS
   */
  var isRunning = false;


  this.add = function (asyncRequest) {
    bucket.push(asyncRequest);

    if (!isRunning) {
      crunch();
    }

  }

  this.status = function () {
    return {
      isRunning: isRunning
    };
  }

  this.stop = function () {
    clearTimeout(timer);
  }

  var crunch = function () {
    if (bucket.length > 0) {
      isRunning = true;
      var asyncRequest = bucket.shift();

      console.log("making async request and waiting " + timeBetweenRequests);
      asyncRequest();

      timer = setTimeout(function () {
        crunch();
      }, timeBetweenRequests);

    } else {
      isRunning = false;
    }
  }
}

module.exports = Throttle;
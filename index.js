
/**
 * class Throttle
 *
 * For a given number of requests, and the number of requests that can occur during that time
 * only call async functions given to the throttle at a rate that complies with the given
 * time restraints.
 *
 * use: var throttle = new Throttle(int, int);
 * throttle.add(asyncFunction, asyncFunctionArgument1, asyncFunctionArgument2, ...);
 * 
 * @param {int} requestCount  number of requests to be made
 * @param {int} perMs         duration of time that the above number of requests can be made in
 */
var Throttle = function (requestCount, perMs) {

  /**
   * GLOBALS
   */

  var bucket = [];
  var timeBetweenRequests = perMs / requestCount;
  var throttleTimer = null;

  /**
   * STATUS
   */
  var isRunning = false;

  /**
   * Add a async request to the throttle queue. Variatic function in that any number of input 
   * parameters will be accepted and passed into the async function.
   * 
   * @param {function} asyncFunction    The function that will be added to the throttle queue and run when it gets it's chance
   * @param {any} functionParameters... Additional arguments will be applied to the async function when it is time to be called
   */
  this.add = function (asyncFunction) {
    var argumentsAsArray = Array.prototype.slice.call(arguments);;
    var asyncRequestFunction = argumentsAsArray.shift();

    var asyncRequestFunctionWithArguments = asyncRequestFunction.bind.apply(asyncRequestFunction, [null].concat(argumentsAsArray));

    bucket.push(asyncRequestFunctionWithArguments);

    if (!isRunning) {
      crunch();
    }
  }

  /**
   * Returns a status object
   * 
   * @return {isRunning: boolean}
   */
  this.status = function () {
    return {
      isRunning: isRunning
    };
  }

  /**
   * Stops the throttle from continuing execution. Does not clear the bucket.
   * Throttle can be enabled again by adding something to the throttle.
   */
  this.stop = function () {
    clearTimeout(timer);
    isRunning = false;
  }

  // recursively works through the request bucket. Ends when the bucket is empty
  var crunch = function () {
    if (bucket.length > 0) {
      isRunning = true;
      var asyncRequest = bucket.shift(); // grab the new async request

      asyncRequest();

      timer = setTimeout(function () { // and wait until the next async is able to run again
        crunch();
      }, timeBetweenRequests);

    } else {
      isRunning = false;
    }
  }
}

module.exports = Throttle;
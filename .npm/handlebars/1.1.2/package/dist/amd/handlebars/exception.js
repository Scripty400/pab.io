define(
  ["exports"],
  function(__exports__) {
    "use strict";

    var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

    function Exception(/* message */) {
      var tmp = Error.prototype.constructor.apply(this, arguments);

      // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
      for (var idx = 0; idx < errorProps.length; idx++) {
        this[errorProps[idx]] = tmp[errorProps[idx]];
      }
    }

    Exception.prototype = new Error();

    __exports__["default"] = Exception;
  });
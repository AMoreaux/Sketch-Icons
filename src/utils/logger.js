export default (function () {
  function _log(message) {
    log(message);
  }

  function debug(message) {
    log('DEBUG: ' + message);
  }

  function info(message) {
    log('INFO: ' + message);
  }

  function warn(message) {
    log('WARN: ' + message);
  }

  function error(message) {
    log('ERROR: ' + message);
  }

  return {
    log: _log,
    debug: debug,
    info: info,
    warn: warn,
    error: error,
  };
})();
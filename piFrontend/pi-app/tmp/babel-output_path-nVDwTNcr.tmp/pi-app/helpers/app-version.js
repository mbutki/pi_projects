define('pi-app/helpers/app-version', ['exports', 'ember', 'pi-app/config/environment'], function (exports, _ember, _piAppConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _piAppConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
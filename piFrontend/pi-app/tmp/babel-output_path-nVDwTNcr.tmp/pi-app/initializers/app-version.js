define('pi-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pi-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _piAppConfigEnvironment) {
  var _config$APP = _piAppConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
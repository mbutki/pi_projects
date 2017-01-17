define('pi-app/tests/helpers/resolver', ['exports', 'pi-app/resolver', 'pi-app/config/environment'], function (exports, _piAppResolver, _piAppConfigEnvironment) {

  var resolver = _piAppResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _piAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _piAppConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
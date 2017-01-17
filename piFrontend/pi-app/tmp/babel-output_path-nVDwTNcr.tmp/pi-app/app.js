define('pi-app/app', ['exports', 'ember', 'pi-app/resolver', 'ember-load-initializers', 'pi-app/config/environment'], function (exports, _ember, _piAppResolver, _emberLoadInitializers, _piAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _piAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _piAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _piAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _piAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
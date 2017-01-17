define('pi-app/tests/helpers/start-app', ['exports', 'ember', 'pi-app/app', 'pi-app/config/environment'], function (exports, _ember, _piAppApp, _piAppConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    // use defaults, but you can override
    var attributes = _ember['default'].assign({}, _piAppConfigEnvironment['default'].APP, attrs);

    _ember['default'].run(function () {
      application = _piAppApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
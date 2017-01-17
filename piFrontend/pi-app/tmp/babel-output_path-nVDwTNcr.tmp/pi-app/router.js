define('pi-app/router', ['exports', 'ember', 'pi-app/config/environment'], function (exports, _ember, _piAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _piAppConfigEnvironment['default'].locationType,
    rootURL: _piAppConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('graphs');
  });

  exports['default'] = Router;
});
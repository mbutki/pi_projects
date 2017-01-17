"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

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
define('pi-app/components/bubble-chart', ['exports', 'ember-charts/components/bubble-chart'], function (exports, _emberChartsComponentsBubbleChart) {
  exports['default'] = _emberChartsComponentsBubbleChart['default'];
});
define('pi-app/components/horizontal-bar-chart', ['exports', 'ember-charts/components/horizontal-bar-chart'], function (exports, _emberChartsComponentsHorizontalBarChart) {
  exports['default'] = _emberChartsComponentsHorizontalBarChart['default'];
});
define('pi-app/components/pie-chart', ['exports', 'ember-charts/components/pie-chart'], function (exports, _emberChartsComponentsPieChart) {
  exports['default'] = _emberChartsComponentsPieChart['default'];
});
define('pi-app/components/scatter-chart', ['exports', 'ember-charts/components/scatter-chart'], function (exports, _emberChartsComponentsScatterChart) {
  exports['default'] = _emberChartsComponentsScatterChart['default'];
});
define('pi-app/components/stacked-vertical-bar-chart', ['exports', 'ember-charts/components/stacked-vertical-bar-chart'], function (exports, _emberChartsComponentsStackedVerticalBarChart) {
  exports['default'] = _emberChartsComponentsStackedVerticalBarChart['default'];
});
define('pi-app/components/time-series-chart', ['exports', 'ember-charts/components/time-series-chart'], function (exports, _emberChartsComponentsTimeSeriesChart) {
  exports['default'] = _emberChartsComponentsTimeSeriesChart['default'];
});
define('pi-app/components/vertical-bar-chart', ['exports', 'ember-charts/components/vertical-bar-chart'], function (exports, _emberChartsComponentsVerticalBarChart) {
  exports['default'] = _emberChartsComponentsVerticalBarChart['default'];
});
define('pi-app/helpers/app-version', ['exports', 'ember', 'pi-app/config/environment'], function (exports, _ember, _piAppConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _piAppConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('pi-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('pi-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('pi-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pi-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _piAppConfigEnvironment) {
  var _config$APP = _piAppConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('pi-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('pi-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('pi-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('pi-app/initializers/export-application-global', ['exports', 'ember', 'pi-app/config/environment'], function (exports, _ember, _piAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_piAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _piAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_piAppConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('pi-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('pi-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('pi-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("pi-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('pi-app/mixins/axis-titles', ['exports', 'ember-charts/mixins/axis-titles'], function (exports, _emberChartsMixinsAxisTitles) {
  exports['default'] = _emberChartsMixinsAxisTitles['default'];
});
define('pi-app/mixins/label-width', ['exports', 'ember-charts/mixins/label-width'], function (exports, _emberChartsMixinsLabelWidth) {
  exports['default'] = _emberChartsMixinsLabelWidth['default'];
});
define('pi-app/mixins/legend', ['exports', 'ember-charts/mixins/legend'], function (exports, _emberChartsMixinsLegend) {
  exports['default'] = _emberChartsMixinsLegend['default'];
});
define('pi-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
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
define('pi-app/routes/graphs', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        // average high temperature (degrees F) by city
    });
});
define('pi-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("pi-app/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "CTtCNoVk", "block": "{\"statements\":[[\"text\",\"Application Route\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pi-app/templates/application.hbs" } });
});
define("pi-app/templates/components/chart-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "jSL3l6TW", "block": "{\"statements\":[[\"open-element\",\"svg\",[]],[\"dynamic-attr\",\"width\",[\"unknown\",[\"outerWidth\"]],null],[\"dynamic-attr\",\"height\",[\"unknown\",[\"outerHeight\"]],null],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"g\",[]],[\"static-attr\",\"class\",\"chart-viewport\"],[\"dynamic-attr\",\"transform\",[\"unknown\",[\"transformViewport\"]],null],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pi-app/templates/components/chart-component.hbs" } });
});
define("pi-app/templates/graphs", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "E/WJ32Qe", "block": "{\"statements\":[[\"text\",\"Graphs Page\\n\\n\"],[\"append\",[\"helper\",[\"time-series-chart\"],null,[[\"data\"],[[\"get\",[\"tempData\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pi-app/templates/graphs.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('pi-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'pi-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("pi-app/app")["default"].create({"name":"pi-app","version":"0.0.0+0e20f887"});
}

/* jshint ignore:end */
//# sourceMappingURL=pi-app.map

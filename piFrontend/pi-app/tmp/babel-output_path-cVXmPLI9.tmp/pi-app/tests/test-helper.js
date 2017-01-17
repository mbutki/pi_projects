define('pi-app/tests/test-helper', ['exports', 'pi-app/tests/helpers/resolver', 'ember-qunit'], function (exports, _piAppTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_piAppTestsHelpersResolver['default']);
});
define('ember-charts/mixins/formattable', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # Getters for formatting human-readable labels from provided data
    formatLabelFunction: _ember['default'].computed('formatLabel', function () {
      return d3.format("," + this.get('formatLabel'));
    }),

    // # String that will be used to format label using d3.format function
    // # More info about d3.format: https://github.com/mbostock/d3/wiki/Formatting
    formatLabel: '.2f'
  });
});
define('ember-charts/mixins/label-width', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var LabelWidthMixin = _ember['default'].Mixin.create({

    // Override maximum width of labels to be a percentage of the total width
    labelWidth: _ember['default'].computed('outerWidth', 'labelWidthMultiplier', function () {
      return this.get('labelWidthMultiplier') * this.get('outerWidth');
    }),

    // The proportion of the chart's width that should be reserved for labels
    labelWidthMultiplier: 0.25
  });

  exports['default'] = LabelWidthMixin;
});
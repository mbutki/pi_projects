define('ember-charts/components/chart-component', ['exports', 'ember', 'ember-charts/mixins/resize-handler', 'ember-charts/mixins/colorable'], function (exports, _ember, _emberChartsMixinsResizeHandler, _emberChartsMixinsColorable) {
  'use strict';

  var ChartComponent = _ember['default'].Component.extend(_emberChartsMixinsColorable['default'], _emberChartsMixinsResizeHandler['default'], {
    layoutName: 'components/chart-component',
    classNames: ['chart-frame', 'scroll-y'],
    isInteractive: true,

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // Margin between viewport and svg boundary
    horizontalMargin: 30,
    verticalMargin: 30,

    /**
     * Optional property to set specific left margin
     * @type {Number}
     */
    horizontalMarginLeft: null,

    /**
     * Optional property to set specific right margin
     * @type {Number}
     */
    horizontalMarginRight: null,

    /**
     * An array of the values in the data that is passed into the chart
     * @type {Array.<Number>}
     */
    allFinishedDataValues: _ember['default'].computed('finishedData.@each.value', function () {
      return this.get('finishedData').map(function (d) {
        return d.value;
      });
    }),

    /**
     * The minimum value of the data in the chart
     * @type {Number}
     */
    minValue: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return d3.min(this.get('allFinishedDataValues'));
    }),

    /**
     * The maximum value of the data in the chart
     * @type {Number}
     */
    maxValue: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return d3.max(this.get('allFinishedDataValues'));
    }),

    /**
     * An array of the values which are at least 0
     * @type {Array<Number>}
     */
    positiveValues: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return this.get('allFinishedDataValues').filter(function (val) {
        return val >= 0;
      });
    }),

    /**
     * An array of the values which are less than 0
     * @type {Array<Number>}
     */
    negativeValues: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return this.get('allFinishedDataValues').filter(function (val) {
        return val < 0;
      });
    }),

    /**
     * Whether or not the data contains negative values.
     * @type {Boolean}
     */
    hasNegativeValues: _ember['default'].computed.lt('minValue', 0),

    /**
     * Whether or not the data contains positive values.
     * @type {Boolean}
     */
    hasPositiveValues: _ember['default'].computed.gt('maxValue', 0),

    /**
     * Whether or not the data contains only positive values.
     * @type {Boolean}
     */
    hasAllNegativeValues: _ember['default'].computed.lte('maxValue', 0),

    /**
     * Whether or not the data contains only negative values.
     * @type {Boolean}
     */
    hasAllPositiveValues: _ember['default'].computed.gte('minValue', 0),

    /**
     * Either a passed in value from `horizontalMarginRight`
     * or the default value from `horizontalMargin`
     * @type {Number}
     */
    marginRight: _ember['default'].computed('horizontalMarginRight', 'horizontalMargin', function () {
      var horizontalMarginRight = this.get('horizontalMarginRight');
      if (_ember['default'].isNone(horizontalMarginRight)) {
        return this.get('horizontalMargin');
      } else {
        return horizontalMarginRight;
      }
    }),

    /**
     * Either a passed in value from `horizontalMarginLeft`
     * or the default value from `horizontalMargin`
     * @type {Number}
     */
    marginLeft: _ember['default'].computed('horizontalMarginLeft', 'horizontalMargin', function () {
      var horizontalMarginLeft = this.get('horizontalMarginLeft');
      if (_ember['default'].isNone(horizontalMarginLeft)) {
        return this.get('horizontalMargin');
      } else {
        return horizontalMarginLeft;
      }
    }),

    marginTop: _ember['default'].computed.alias('verticalMargin'),
    marginBottom: _ember['default'].computed.alias('verticalMargin'),

    // TODO: Rename outer to SVG?
    defaultOuterHeight: 500,
    defaultOuterWidth: 700,
    outerHeight: _ember['default'].computed.alias('defaultOuterHeight'),
    outerWidth: _ember['default'].computed.alias('defaultOuterWidth'),

    width: _ember['default'].computed('outerWidth', 'marginLeft', 'marginRight', function () {
      return this.get('outerWidth') - this.get('marginLeft') - this.get('marginRight');
    }),

    height: _ember['default'].computed('outerHeight', 'marginBottom', 'marginTop', function () {
      return Math.max(1, this.get('outerHeight') - this.get('marginBottom') - this.get('marginTop'));
    }),

    // Hierarchy of chart view is:
    // 1 Outside most element is div.chart-frame
    // 2 Next element is svg
    // 3 Finally, g.chart-viewport
    $viewport: _ember['default'].computed(function () {
      return this.$('.chart-viewport')[0];
    }),

    viewport: _ember['default'].computed(function () {
      return d3.select(this.get('$viewport'));
    }),

    // Transform the view commonly displaced by the margin
    transformViewport: _ember['default'].computed('marginLeft', 'marginTop', function () {
      var left = this.get('marginLeft');
      var top = this.get('marginTop');
      return 'translate(' + left + ',' + top + ')';
    }),

    // ----------------------------------------------------------------------------
    // Labels
    // ----------------------------------------------------------------------------
    // Padding between label and zeroline, or label and graphic
    labelPadding: 10,

    // Padding allocated for axes on left of graph
    labelWidth: 30,
    labelHeight: 15,

    labelWidthOffset: _ember['default'].computed('labelWidth', 'labelPadding', function () {
      return this.get('labelWidth') + this.get('labelPadding');
    }),

    labelHeightOffset: _ember['default'].computed('labelHeight', 'labelPadding', function () {
      return this.get('labelHeight') + this.get('labelPadding');
    }),

    // ----------------------------------------------------------------------------
    // Graphic/NonGraphic Layout
    // I.e., some charts will care about the dimensions of the actual chart graphic
    // space vs. other drawing space, e.g., axes, labels, legends.
    // TODO(tony): Consider this being a mixin for axes/legends and it just happens
    // to be a redundant mixin. This is a problem though because we would not want
    // to override things like graphicTop, we instead would want the changes to be
    // cumulative.
    // ----------------------------------------------------------------------------
    graphicTop: 0,
    graphicLeft: 0,
    graphicWidth: _ember['default'].computed.alias('width'),
    graphicHeight: _ember['default'].computed.alias('height'),

    graphicBottom: _ember['default'].computed('graphicTop', 'graphicHeight', function () {
      return this.get('graphicTop') + this.get('graphicHeight');
    }),

    graphicRight: _ember['default'].computed('graphicLeft', 'graphicWidth', function () {
      return this.get('graphicLeft') + this.get('graphicWidth');
    }),

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    hasNoData: _ember['default'].computed('finishedData', function () {
      return _ember['default'].isEmpty(this.get('finishedData'));
    }),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    // Observe important variables and trigger chart redraw when they change
    concatenatedProperties: ['renderVars'],

    // Every chart will trigger a redraw when these variables change, through the
    // magic of concatenatedProperties any class that overrides the variable
    // renderVars will actually just be appending names to the list
    renderVars: ['finishedData', 'width', 'height', 'margin', 'isInteractive'],

    init: function init() {
      var _this = this;

      this._super();
      _.uniq(this.get('renderVars')).forEach(function (renderVar) {
        _this.addObserver(renderVar, _this.drawOnce);
        // This is just to ensure that observers added above fire even
        // if that renderVar is not consumed elsewhere.
        _this.get(renderVar);
      });
    },

    willDestroyElement: function willDestroyElement() {
      var _this2 = this;

      _.uniq(this.get('renderVars')).forEach(function (renderVar) {
        _this2.removeObserver(renderVar, _this2, _this2.drawOnce);
      });
      this._super();
    },

    didInsertElement: function didInsertElement() {
      this._super();
      this._updateDimensions();
      this.drawOnce();
    },

    drawOnce: function drawOnce() {
      _ember['default'].run.once(this, this.get('draw'));
    },

    onResizeEnd: function onResizeEnd() {
      this._updateDimensions();
    },

    // Wrap the chart in a container div that is the same size
    _updateDimensions: function _updateDimensions() {
      this.set('defaultOuterHeight', this.$().height());
      this.set('defaultOuterWidth', this.$().width());
    },

    clearChart: function clearChart() {
      this.$('.chart-viewport').children().remove();
    },

    // Remove previous drawing
    draw: function draw() {
      if ((this._state || this.state) !== "inDOM") {
        return;
      }

      if (this.get('hasNoData')) {
        return this.clearChart();
      } else {
        return this.drawChart();
      }
    }
  });

  exports['default'] = ChartComponent;
});
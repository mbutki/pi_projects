define('ember-charts/mixins/axes', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # ------------------------------------------------------------------------
    // # API -- Inputs
    // #
    // # graphicWidth (req.): The width of the graphic to be given axes
    // # graphicHeight (req.): The width of the graphic to be given axes
    // # minXTicks: The minimum number of ticks to appear on the X axis
    // # minYTicks: The minimum number of ticks to appear on the Y axis
    // # tickSpacing: Number of pixels between ticks on axes
    // # minAxisValue: The minimum value appearing on an axis using numeric values
    // # maxAxisValue: The maximum value appearing on an axis using numeric values
    // # ------------------------------------------------------------------------
    graphicWidth: null,
    graphicHeight: null,
    minXTicks: 3,
    minYTicks: 3,
    minAxisValue: 0,
    maxAxisValue: 0,

    /**
     * We used to have only one option to set tick spacing for both x and y axes.
     * We keep this attribute for backward compatibility.
     * @type {number}
     * @deprecated This will be deprecated in version 1.0.
     */
    tickSpacing: 50,

    /**
     * Tick spacing on X axis. Set this value if we want a different tickSpacing
     * for X axis other than the default one set in tickSpacing for both axes
     * @type {number}
     */
    tickSpacingX: null,

    /**
     * Tick spacing on Y axis. Set this value if we want a different tickSpacing
     * for Y axis other than the default one set in tickSpacing for both axes
     * @type {number}
     */
    tickSpacingY: null,

    /**
     * This will be used for all internal calculation of tick spacing on X axis.
     * We set higher priority if the specific tickSpacingX's value is set.
     * @type {number}
     * @private
     */
    _innerTickSpacingX: _ember['default'].computed('tickSpacingX', 'tickSpacing', function () {
      var tickSpacingX = this.get('tickSpacingX');
      if (_ember['default'].isNone(tickSpacingX)) {
        return this.get('tickSpacing');
      }
      return tickSpacingX;
    }),

    /**
     * This will be used for all internal calculation of tick spacing on Y axis.
     * We set higher priority if the specific tickSpacingY's value is set.
     * @type {number}
     * @private
     */
    _innerTickSpacingY: _ember['default'].computed('tickSpacingY', 'tickSpacing', function () {
      var tickSpacingY = this.get('tickSpacingY');
      if (_ember['default'].isNone(tickSpacingY)) {
        return this.get('tickSpacing');
      }
      return tickSpacingY;
    }),

    // # ------------------------------------------------------------------------
    // # API -- Outputs
    // #
    // # numXTicks: Number of ticks on the X axis
    // # numYTicks: Number of ticks on the Y axis
    // # formatValueAxis: Overridable formatter for numeric values along an axis
    // # ------------------------------------------------------------------------
    numXTicks: _ember['default'].computed('graphicWidth', '_innerTickSpacingX', 'minXTicks', function () {
      var tickSpacing = this.get('_innerTickSpacingX');
      var numOfTicks = Math.floor(this.get('graphicWidth') / tickSpacing);
      return Math.max(numOfTicks, this.get('minXTicks'));
    }),

    numYTicks: _ember['default'].computed('graphicHeight', '_innerTickSpacingY', 'minYTicks', function () {
      var tickSpacing = this.get('_innerTickSpacingY');
      var numOfTicks = Math.floor(this.get('graphicHeight') / tickSpacing);
      return Math.max(numOfTicks, this.get('minYTicks'));
    }),

    formatValueAxis: _ember['default'].computed('minAxisValue', 'maxAxisValue', function () {
      // # Base the format prefix on largest magnitude (e.g. if we cross from
      // # hundreds of thousands into millions, use millions)
      var absMinAxisValue = Math.abs(this.get('minAxisValue'));
      var absMaxAxisValue = Math.abs(this.get('maxAxisValue'));
      var magnitude = Math.max(absMinAxisValue, absMaxAxisValue);
      var prefix = d3.formatPrefix(magnitude);
      return function (value) {
        return "" + prefix.scale(value) + prefix.symbol;
      };
    })
  });
});
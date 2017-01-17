define('ember-charts/mixins/resize-handler', ['exports', 'ember'], function (exports, _ember) {
  // TODO(azirbel): This needs to be an external dependency.
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({
    resizeEndDelay: 200,
    resizing: false,
    onResizeStart: _ember['default'].K,
    onResizeEnd: _ember['default'].K,
    onResize: _ember['default'].K,

    endResize: _ember['default'].computed(function () {
      return function (event) {
        if (this.isDestroyed) {
          return;
        }
        this.set('resizing', false);
        if (_.isFunction(this.onResizeEnd)) {
          this.onResizeEnd(event);
        }
      };
    }),

    handleWindowResize: function handleWindowResize(event) {
      if (typeof event.target.id !== "undefined" && event.target.id !== null && event.target.id !== this.elementId) {
        return;
      }
      if (!this.get('resizing')) {
        this.set('resizing', true);
        if (_.isFunction(this.onResizeStart)) {
          this.onResizeStart(event);
        }
      }
      if (_.isFunction(this.onResize)) {
        this.onResize(event);
      }
      return _ember['default'].run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
    },

    didInsertElement: function didInsertElement() {
      this._super();
      return this._setupDocumentHandlers();
    },

    willDestroyElement: function willDestroyElement() {
      this._removeDocumentHandlers();
      return this._super();
    },

    _setupDocumentHandlers: function _setupDocumentHandlers() {
      if (this._resizeHandler) {
        return;
      }
      this._resizeHandler = _ember['default'].$.proxy(this.get('handleWindowResize'), this);
      return _ember['default'].$(window).on("resize." + this.elementId, this._resizeHandler);
    },

    _removeDocumentHandlers: function _removeDocumentHandlers() {
      _ember['default'].$(window).off("resize." + this.elementId, this._resizeHandler);
      return this._resizeHandler = null;
    }
  });
});
define('ember-charts/mixins/sortable-chart', ['exports', 'ember'], function (exports, _ember) {
  // # This allows chart data to be displayed in ascending or descending order as specified by
  // # the data points property sortKey. The order is determined by sortAscending.
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({
    sortKey: 'value',
    sortAscending: true,

    sortedData: _ember['default'].computed('data.[]', 'sortKey', 'sortAscending', function () {
      var data = this.get('data');
      var key = this.get('sortKey');
      var sortAscending = this.get('sortAscending');

      if (_ember['default'].isEmpty(data)) {
        return [];
      } else if (key != null) {
        if (sortAscending) {
          return _.sortBy(data, key);
        } else {
          return _.sortBy(data, key).reverse();
        }
      } else {
        return data;
      }
    })
  });
});
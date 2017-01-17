import DS from 'ember-data';

export default DS.Model.extend({
  location: DS.attr('string'),
  times: DS.attr(),
  values: DS.attr()
});

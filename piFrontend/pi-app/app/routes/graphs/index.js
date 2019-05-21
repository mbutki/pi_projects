import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
          graphs: this.store.findAll('graph'),
          lights: this.store.findAll('light'),
          humidities: this.store.findAll('humidity'),
          securityStatuses: this.store.findAll('securityStatus')
        });
    },

    setupController(controller, models) {
        controller.set('graphs', models.graphs);
        controller.set('lights', models.lights);
        controller.set('humidities', models.humidities);
        controller.set('securityStatuses', models.securityStatuses);
    }
});

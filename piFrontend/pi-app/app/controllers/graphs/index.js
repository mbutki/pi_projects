import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    tempChartData: Ember.computed('model', function() {
        let graph_data = {
            labels: this.get('model')[0].times.map((date) => moment(date).format('M/D/YY h:m A')),
            datasets: [{
                label: this.get('model')[0].location,
                data: this.get('model')[0].values,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                pointBorderColor: "rgba(75,192,192,1)",
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10
            }]
        };
        return graph_data;
    }),
    tempChartOptions: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Temperature (F)'
              }
            }]
        }
    }
});

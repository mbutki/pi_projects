import Ember from 'ember';
//import moment from 'moment';

export default Ember.Controller.extend({
    tempChartData: Ember.computed('model', function() {
        let model = this.get('model');
        let content = model.content;

        let graph_data = {
            datasets: []
        };

        let colors = [
            'rgba(52, 152, 219',
            'rgba(46, 204, 113',
            'rgba(155, 89, 182',
            'rgba(52, 73, 94',
            'rgba(230, 126, 34',
            'rgba(241, 196, 15'
        ];

        for (let i=0; i < content.length; i++) {
            let internal_data = content[i]._data;
            
            let data = [];
            for (let j=0; j < internal_data.times.length; j++) {
                let date = new Date(internal_data.times[j]);
                data.push({x:date, 
                           y:internal_data.values[j]});
            }
            
            graph_data.datasets.push({
                label: internal_data.location,
                data: data,
                backgroundColor: colors[i] + ',0)',
                borderColor: colors[i] + ',1)',
                /*pointBorderColor: "rgba(75,192,192,1)",
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",*/
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            });
        }
        return graph_data;
    }),
    tempChartOptions: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Temperature (F)',
                fontSize: 18
              },
                ticks: {
                    fontSize: 18
                }
            }],
            xAxes: [{
                type: 'time',
                position: 'bottom',
                time: {
                    displayFormats: {
                        hour: 'ddd h:mm A'
                    },
                    unit: 'hour',
                    unitStepSize: 12
                },
                ticks: {
                    fontSize: 16
                }
            }]
        }
    }
});

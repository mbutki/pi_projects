import Ember from 'ember';

export default Ember.Controller.extend({
    securityStatusChartData: Ember.computed('securityStatuses', function() {
        let model = this.get('securityStatuses');
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
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                lineTension: 0,
            });
        }
        return graph_data;
    }),
    securityStatusChartOptions: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'securityStatus',
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
                    unitStepSize: 12,
                    max: new Date(),
                    min: new Date(new Date(new Date().setHours(0,0,0,0))- 1000*60*60*24*7),
                    tooltipFormat: 'ddd h:mm A'
                },
                ticks: {
                    fontSize: 16
                }
            }]
        }
    },
    humidityChartData: Ember.computed('humidities', function() {
        let model = this.get('humidities');
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
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            });
        }
        return graph_data;
    }),
    humidityChartOptions: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Humidity',
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
                    unitStepSize: 12,
                    max: new Date(),
                    min: new Date(new Date(new Date().setHours(0,0,0,0))- 1000*60*60*24*7),
                    tooltipFormat: 'ddd h:mm A'
                },
                ticks: {
                    fontSize: 16
                }
            }]
        }
    },
    lightChartData: Ember.computed('lights', function() {
        let model = this.get('lights');
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
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            });
        }
        return graph_data;
    }),
    lightChartOptions: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Brightness (Volts)',
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
                    unitStepSize: 12,
                    max: new Date(),
                    min: new Date(new Date(new Date().setHours(0,0,0,0))- 1000*60*60*24*7),
                    tooltipFormat: 'ddd h:mm A'
                },
                ticks: {
                    fontSize: 16
                }
            }]
        }
    },
    tempChartData: Ember.computed('graphs', function() {
        let model = this.get('graphs');
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
                    unitStepSize: 12,
                    max: new Date(),
                    min: new Date(new Date(new Date().setHours(0,0,0,0))- 1000*60*60*24*7),
                    tooltipFormat: 'ddd h:mm A'
                },
                ticks: {
                    fontSize: 16
                }
            }]
        }
    }
});

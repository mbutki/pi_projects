import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
const moment = require('moment-timezone');

class TempGraph extends PureComponent {
  processData(data) {
    const series = [];
    for (let j = 0; j < data.length; j++) {
      const item = data[j];
      const points = [];
      for (let i = 0; i < item.times.length; i++) {
        if (i % 5 !== 0) {
          continue;
        }
        points.push({'time': parseInt(item.times[i].substr(0, 10)),
                      'value': parseFloat(Number(item.values[i]).toFixed(2))});
      }
      
      const entry = {'name': item.loc,
                'data': points};
      series.push(entry);
    }
    return series;
  }

  formatLines(series) {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', 'black', '#FF8042'];

    const lines = [];
    for (let k=0; k < series.length; k++) {
      lines.push(<Line
        dataKey="value"
        data={series[k].data}
        name={series[k].name}
        key={series[k].name}
        dot={false}
        stroke={colors[k]}
        type="monotone"
        />);
    }

    return lines;
  }

  render() {
    const series = this.processData(this.props.data);
    const lines = this.formatLines(series);

    return (
      <LineChart
        height={300}
        width={600}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          //tickFormatter={(tickItem) => {
          //  return moment.unix(tickItem).tz('America/Los_Angeles').format('MM/DD:ha');
          //}}
          tick={<CustomizedAxisTick/>}
          type = 'number'
          name = 'Time'
          scale = 'time'
          domain={['dataMin', 'dataMax']}
          height = {40}
        />
        <YAxis
          dataKey="value"
          type = 'number'
          unit = ' Lux'
          domain={['dataMin', 'dataMax']}
        />
        <Tooltip 
          labelFormatter={(tickItem) => {
            return moment.unix(tickItem).tz('America/Los_Angeles').format('MM/DD: ha');
          }}
        />
        <Legend verticalAlign="top"/>
        {lines}
      </LineChart>
    );
  }
}

class CustomizedAxisTick extends React.Component {
  render () {
    const {x, y, payload, width, maxChars, lineHeight, fontSize, fill} = this.props;
    const str = moment.unix(payload.value).tz('America/Los_Angeles').format('MM/DD  ha')
    const rx = new RegExp(`.{1,5}`, 'g');
    const chunks = str.replace(/-/g,' ').split(' ').map(s => s.match(rx)).flat();
    const tspans = chunks.map((s,i) => <tspan x={0} y={11} dy={(i*11)}>{s}</tspan>);
    return ( 
      <g transform={`translate(${x},${y})`}>
        <text width={width} height="auto" textAnchor="middle" fontSize={fontSize} fill={fill}>
          {tspans}
        </text>
      </g>
    );
  }
};

export default TempGraph;

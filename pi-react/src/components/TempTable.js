import React, { Component } from 'react';
const moment = require('moment-timezone');

class TempTable extends Component {
  Comparator(a, b) {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
   }

  createList(data) {
    let list = data.map(
      item => {
        const loc = item.loc;
        const temp = parseFloat(Number(item.values[item.values.length-1]).toFixed(0));
        const timeEpoch = parseInt(item.times[item.times.length-1].substr(0, 10));
        const time = moment.unix(timeEpoch).tz('America/Los_Angeles').format('h:mm a');
        
        return [loc, temp, time];
      }
    );

    return list.sort(this.Comparator);
  }

  render() {
    const jsx = [(
        <tr>
          <th>Location</th>
          <th>Temp</th>
          <th>Time</th>
        </tr>
    )];


    const list = this.createList(this.props.data);
    for (let item of list) {
      jsx.push((
        <tr>
          <th>{item[0]}</th>
          <th>{item[1]}°F</th>
          <th>{item[2]}</th>
        </tr>
      ))
    }

    return <table>{jsx}</table>;
  }
}

export default TempTable;

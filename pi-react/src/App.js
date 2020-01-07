import React from 'react';
import { Component } from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment';
import graphql from 'babel-plugin-relay/macro';
import TempGraph from './components/TempGraph.js';
import TempTable from './components/TempTable.js';
import HumidGraph from './components/HumidGraph.js';
import LightGraph from './components/LightGraph.js';

export default class Example extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery {
            getTemp {
              loc
              times
              values
            } 
            getHumid {
              loc
              times
              values
            } 
            getLight {
              loc
              times
              values
            } 
          }
        `}
        variables={{}}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }

          let indoorTemps = props['getTemp'].reduce((result, temp) => {
              if (temp.loc !== 'frontDoor') {
                result.push(temp);
              }
              return result;
          }, []);


          let outdoorTemps = props['getTemp'].reduce((result, temp) => {
              if (temp.loc === 'frontDoor') {
               result.push(temp);
              }
              return result;
          }, []);

          return (
            <div>
              <h1>Temperature</h1>
              <TempTable data={props['getTemp']} />
              <br/><br/><br/>

              <TempGraph data={indoorTemps} />
              <TempGraph data={outdoorTemps} />
              <br/><br/><br/>

              <h1>Humidity</h1>
              <HumidGraph data={props['getHumid']} />
              <br/><br/><br/>

              <h1>Light</h1>
              <LightGraph data={props['getLight']} />


              <h1>Web Cams</h1>
              <a href="http://www.mbutki.com:8080/">Web Cam Website</a>
              <h3>Static Screenshots</h3>
              <br/>
              <img src="http://192.168.86.204/picture/2/current/?_username=admin&_signature=921e8825a488d97e76103d6feeb39f5280330764" />
              <img src="http://192.168.86.204/picture/1/current/?_username=admin&_signature=d8c7f6315899d385e4710f040623be8f0e1a0d4d" />
            </div>
          );
        }}
      />
    );
  }
}

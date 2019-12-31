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
            getTemps {
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

          let indoorTemps = props['getTemps'].reduce((result, temp) => {
              if (temp.loc !== 'frontDoor') {
                result.push(temp);
              }
              return result;
          }, []);


          let outdoorTemps = props['getTemps'].reduce((result, temp) => {
              if (temp.loc === 'frontDoor') {
               result.push(temp);
              }
              return result;
          }, []);

          return (
            <div>
              <h1>Temperature</h1>
              <TempTable data={props['getTemps']} />
              <br/><br/><br/>

              <TempGraph data={indoorTemps} />
              <TempGraph data={outdoorTemps} />
              <br/><br/><br/>

              <h1>Humidity</h1>
              <HumidGraph data={props['getHumid']} />
              <br/><br/><br/>

              <h1>Light</h1>
              <LightGraph data={props['getLight']} />
            </div>
          );
        }}
      />
    );
  }
}

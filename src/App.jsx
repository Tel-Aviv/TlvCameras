import React from 'react';
import { requestSubscription, QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';

import GMap from './GMap';
import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryMotorcycles from './SummaryMotorcycles';
import SummaryChart from './SummaryChart';

const summariesQuery = graphql`
query AppSummaries_Query ($Id: Int!,
                          $beforeHours: Int)
{
  camera(Id: $Id, beforeHours: $beforeHours) {
    ...SummaryCars_totals @arguments(Id: $Id)
    ...SummaryBikes_totals @arguments(Id: $Id)
    ...SummaryMotorcycles_totals @arguments(Id: $Id)
  }
  traffic(beforeHours: $beforeHours) {
    ...SummaryChart_totals
  }
}
`;

const observationsSubscription = graphql`
  subscription App_Subscription {
    newObservtion{
      cars
      bikes
      motorcyrcles
      when_observed
    }
  }
`;

class AppLayout extends React.Component {

  constructor()
  {
    super();

    this.renderSummaries = this.renderSummaries.bind(this);
  }

  componentDidMount() {

    const subscriptionConfig = {
      subscription: observationsSubscription,
      variables: {},
      updater: proxyStore => {
        //  Reading values off the Payload
        const rootField = proxyStore.getRootField('newObservtion');
        const __cars = rootField.getValue('cars');
        const __bikes = rootField.getValue('bikes');
        const __motorcycles = rootField.getValue('motorcyrcles');

        // Reading Values off the Relay Store
        let root = proxyStore.getRoot();
        let _type = root.getType();

        const cameraRecord = root.getLinkedRecord('camera', {
          Id: 4,
          beforeHours: new Date().getHours() + 1
        });
        if( cameraRecord ) {
          const observationRecord = cameraRecord.getLinkedRecord('observation');

          let observedCars = observationRecord.getValue('cars');
          observationRecord.setValue(observedCars + __cars, 'cars');

          let observedBikes = observationRecord.getValue('bikes');
          observationRecord.setValue(observedBikes + __bikes, 'bikes');

          let observedMotorcyrcles = observationRecord.getValue('motorcyrcles');
          observationRecord.setValue(observedMotorcyrcles + __motorcycles, 'motorcyrcles');
        }

        const trafficRecord = root.getLinkedRecord('traffic', {
          beforeHours: new Date().getHours() + 1
        });
        if( trafficRecord ) {
          let seriesRecords = trafficRecord.getLinkedRecords('series');
          if( seriesRecords ) {
              for(let i = 0; i < seriesRecords.length; i++) {
                let label = seriesRecords[i].getValue('label');

                let data = seriesRecords[i].getValue('data');
                let _data =   _.map(data, _.clone); // clone data in order to be able to change it
                if( label == 'Cars' ) {
                  _data[_data.length - 1] += __cars;
                } else if( label == 'Bikes' ) {
                  _data[_data.length - 1] += __bikes;
                } else if( label == 'Motorcyrcles') {
                  _data[_data.length - 1] += __motorcycles;
                }

                seriesRecords[i].setValue(_data, 'data');
              }
          }
        }

      },
      onError: error => {
        console.error(`An error occured:`, error);
      }
    };

    requestSubscription(
      environment,
      subscriptionConfig
    );
  }

  renderSummaries({error, props}) {
    if( error ) {
			return (<main className="main-container">
                  <div className="main-content graphqlConnectionError">
                    {error.message}
                  </div>
              </main>)
		} else if ( props ) {
       return (
              <React.Fragment>
                  <main className="main-container">
                    <div className="main-content">
                      <div className="row">
                        <GMap />
                        <SummaryCars totals={props.camera} />
                        <SummaryBikes totals={props.camera}/>
                        <SummaryMotorcycles totals={props.camera}  />
                        <SummaryChart totals={props.traffic}/>
                    </div>
                    </div>
                  </main>
                </React.Fragment>
               )
    }

    return <div>Loading...</div>
  }

  render() {

      let queryVariables = {
        Id: 4,
        beforeHours: new Date().getHours() + 1
      };

      return <QueryRenderer
                environment={environment}
                query={summariesQuery}
                variables={queryVariables}
                render={this.renderSummaries}
              />
  }

}

export default AppLayout;

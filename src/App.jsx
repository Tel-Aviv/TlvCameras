import React from 'react';
import { requestSubscription, QueryRenderer, graphql } from 'react-relay';
import { connect } from 'react-redux'
import environment from './Environment';

import Header from './Header';
import GMap from './GMap';
import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryMotorcycles from './SummaryMotorcycles';
import SummaryChart from './SummaryChart';

const summariesQuery = graphql`
query AppSummaries_Query ($cameraId: Int!,
                          $beforeHours: Int)
{
  camera(cameraId: $cameraId, beforeHours: $beforeHours) {
    cameraId
    ...SummaryCars_totals @arguments(Id: $cameraId)
    ...SummaryBikes_totals @arguments(Id: $cameraId)
    ...SummaryMotorcycles_totals @arguments(Id: $cameraId)
  }
  traffic(cameraId: $cameraId, beforeHours: $beforeHours) {
    ...SummaryChart_totals
  }
  devices {
    ...GMap_devices
  }
}
`;

const observationsSubscription = graphql`
  subscription App_Subscription
  (
    $cameraId: Int!
  )
  {
    newObservation (cameraId: $cameraId) {
      cars
      bikes
      motorcyrcles
      when_observed
    }
  }
`;

class App extends React.Component {

  constructor()
  {
    super();

    this.state = {
      subscription: {}
    }

    this.renderSummaries = this.renderSummaries.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps){

    const _variables = {
      cameraId: nextProps.cameraId
    }

    const subscriptionConfig = {
      subscription: observationsSubscription,
      variables: _variables,
      updater: proxyStore => {
        //  Reading values off the Payload
        const rootField = proxyStore.getRootField('newObservation');
        const __cars = rootField.getValue('cars');
        const __bikes = rootField.getValue('bikes');
        const __motorcycles = rootField.getValue('motorcyrcles');

        // Reading Values off the Relay Store
        let root = proxyStore.getRoot();
        let _type = root.getType();

        const cameraRecord = root.getLinkedRecord('camera', {
          cameraId: 0,
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
          cameraId: 0,
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

    let disposable = requestSubscription(
      environment,
      subscriptionConfig
    );

    this.setState({
      subscription: disposable
    });

    //this.state.subscription.dispose();
  }

  renderSummaries({error, props}) {
    if( error ) {
			return (<main className="main-container">
                  <div className="main-content graphqlConnectionError">
                    {error.message}
                  </div>
              </main>)
		} else if ( props ) {
       return (<React.Fragment>
               <Header />
               <main className="main-container">
                    <div className="main-content">
                      <div className="row">
                        <GMap devices={props.devices[0]} />
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
        cameraId: 0,
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

function mapStateToProps(state) {

  return {
    cameraId: state.cameraId,
  }

}

export default connect(mapStateToProps)(App);

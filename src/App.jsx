// @flow
import React from 'react';
import { requestSubscription, QueryRenderer, graphql } from 'react-relay';
import Modal from 'react-modal';
import environment from './Environment';

import Header from './Header';
import CamerasMap from './CamerasMap';
import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryMotorcycles from './SummaryMotorcycles';
import SummaryPedestrians from './SummaryPedestrians';
import SummaryChart from './SummaryChart';

const summariesQuery = graphql`
query AppSummaries_Query ($cameraId: Int!,
                          $beforeHours: Int)
{
  camera(cameraId: $cameraId, beforeHours: $beforeHours) {
    cameraId
    ...SummaryCars_totals
    ...SummaryBikes_totals
    ...SummaryMotorcycles_totals
    ...SummaryPedestrians_totals
  }
  traffic(cameraId: $cameraId, beforeHours: $beforeHours) {
    ...SummaryChart_totals
  }
  devices {
    ...CamerasMap_devices
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
      motorcycles
      pedestrians
      when_observed
    }
  }
`;

const customModalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    width                 : '600px',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

type State = {
  cameraId: number,
  subscription: Object
}

class App extends React.Component<Props, State> {

  state = {
    cameraId: 0,
    subscription: {},
  };

  constructor(props)
  {
    super(props);
  }

  componentDidMount() {
    ::this.establishSubscription(this.props.match.params.cameraId);
  }

  UNSAFE_componentWillReceiveProps(nextProps){

    if( !_.isEmpty(this.state.subscription) ) {
      this.state.subscription.dispose();
    }

    const cameraId = nextProps.match.params.cameraId;
    ::this.establishSubscription(cameraId);

  }

  establishSubscription(cameraId: number) {

    const _variables = {
      cameraId: cameraId
    }

    const subscriptionConfig = {
      subscription: observationsSubscription,
      variables: _variables,
      updater: proxyStore => {
        //  Reading values off the Payload
        const rootField = proxyStore.getRootField('newObservation');
        const __cars = rootField.getValue('cars');
        const __bikes = rootField.getValue('bikes');
        const __motorcycles = rootField.getValue('motorcycles');
        const __pedestrians = rootField.getValue('pedestrians');

        // Reading Values off the Relay Store
        let root = proxyStore.getRoot();
        let _type = root.getType();

        const cameraRecord = root.getLinkedRecord('camera', {
          cameraId: cameraId,
          beforeHours: new Date().getHours() + 1
        });
        if( cameraRecord ) {
          const observationRecord = cameraRecord.getLinkedRecord('observation');

          let observedCars = observationRecord.getValue('cars');
          observationRecord.setValue(observedCars + __cars, 'cars');

          let observedBikes = observationRecord.getValue('bikes');
          observationRecord.setValue(observedBikes + __bikes, 'bikes');

          let observedMotorcyrcles = observationRecord.getValue('motorcycles');
          observationRecord.setValue(observedMotorcyrcles + __motorcycles, 'motorcycles');

          let observedPedestrians = observationRecord.getValue('pedestrians');
          observationRecord.setValue(observedPedestrians + __pedestrians, 'pedestrians');
        }

        const trafficRecord = root.getLinkedRecord('traffic', {
          cameraId: cameraId,
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
        console.error(`An error occured: ${error}`);
      }
    };

    let disposable = requestSubscription(
      environment,
      subscriptionConfig
    );

    this.setState({
      subscription: disposable
    });

  }

  renderSummaries({error, props}) {
    if( error ) {
			return (<main className="main-container">
                  <div className="main-content graphqlConnectionError">
                    {error.message}
                  </div>
              </main>)
		} else if ( props ) {

      const mapParams = {
        v: '3.exp',
        key: 'AIzaSyA-d98pGdPlRGw4OxvmCg8X4FoykxBYhLE'
      };

       return (<React.Fragment>
                 <Header />
                 <main className="main-container">
                      <div className="main-content">
                        <div className="row">
                          <div className="col-lg-4">
                            <CamerasMap devices={props.devices} />
                          </div>
                          <div className="col-lg-2">
                            <SummaryCars totals={props.camera} />
                          </div>
                          <div className="col-lg-2">
                            <SummaryBikes totals={props.camera}/>
                          </div>
                          <div className="col-lg-2">
                            <SummaryMotorcycles totals={props.camera}  />
                          </div>
                          <div className="col-lg-2">
                            <SummaryPedestrians totals={props.camera} />
                          </div>
                          <div className="col-12">
                            <SummaryChart totals={props.traffic}/>
                          </div>

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
        cameraId: this.props.match.params.cameraId,
        beforeHours: new Date().getHours() + 1
      };

      return <QueryRenderer
                environment={environment}
                query={summariesQuery}
                variables={queryVariables}
                render={::this.renderSummaries}
              />
  }

}

export default App;

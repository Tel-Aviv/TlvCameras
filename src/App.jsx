import React from 'react';
import { requestSubscription, QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';

import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryMotorcycles from './SummaryMotorcycles';

const summariesQuery = graphql`
query AppSummaries_Query ($Id: Int!,
                          $beforeHours: Int)
{
  camera(Id: $Id, beforeHours: $beforeHours) {
    ...SummaryCars_totals @arguments(Id: $Id)
    ...SummaryBikes_totals @arguments(Id: $Id)
    ...SummaryMotorcycles_totals @arguments(Id: $Id)
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
      onNext: payload => {
        console.log('onNext');
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
                  <aside className="sidebar sidebar-expand-lg sidebar-light sidebar-sm sidebar-color-info">
                    <header className="sidebar-header bg-info">
                      <span className="logo">TLV Cameras</span>
                    </header>
    							</aside>
                  <main className="main-container">
                    <div className="main-content">
                      <div className="row">
                        <SummaryCars totals={props.camera} />
                        <SummaryBikes totals={props.camera}/>
                        <SummaryMotorcycles totals={props.camera}  />
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
        beforeHours: 24
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

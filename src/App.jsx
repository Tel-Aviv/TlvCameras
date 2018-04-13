import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';

import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryMotorcycles from './SummaryMotorcycles';

const summariesQuery = graphql`
query AppSummaries_Query
{
  camera {
    ...SummaryCars_totals
    ...SummaryBikes_totals
    ...SummaryMotorcycles_totals
  }
}
`;

class AppLayout extends React.Component {

  constructor()
  {
    super();

    this.renderSummaries = this.renderSummaries.bind(this);
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

      let queryVariables = {};

      return <QueryRenderer
                environment={environment}
                query={summariesQuery}
                variables={queryVariables}
                render={this.renderSummaries}
              />
  }

}

export default AppLayout;

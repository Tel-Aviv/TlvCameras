import React from 'react';

import SummaryCars from './SummaryCars';
import SummaryBikes from './SummaryBikes';
import SummaryPedestrians from './SummaryPedestrians';

class AppLayout extends React.Component {
  render() {
    return (<React.Fragment>
              <SummaryCars />
              <SummaryBikes />
              <SummaryPedestrians />
            </React.Fragment>)
  }
}

export default AppLayout;
